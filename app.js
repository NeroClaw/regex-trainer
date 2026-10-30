/* Regex Drills — moteur d'exercices
   La correction passe par l'exécution réelle de la regex saisie, jamais par comparaison de chaînes. */

(function () {
  'use strict';

  var CHAPTERS = window.CHAPTERS || [];
  var STORAGE_KEY = 'nero-regex-drills-v1';
  var REVEAL_AFTER = 3;

  var state = {
    chapter: 0,
    index: 0,
    solved: {},
    attempts: {}
  };

  var dom = {};

  /* ---------------------------------------------------------------- utils */

  function totalExercises() {
    return CHAPTERS.reduce(function (sum, ch) { return sum + ch.exercises.length; }, 0);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      state.solved = parsed.solved || {};
      state.attempts = parsed.attempts || {};
      state.chapter = Math.min(Math.max(parsed.chapter || 0, 0), CHAPTERS.length - 1);
      var ch = CHAPTERS[state.chapter];
      state.index = Math.min(Math.max(parsed.index || 0, 0), ch.exercises.length - 1);
    } catch (err) {
      /* storage indisponible ou corrompu : on repart à zéro */
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        solved: state.solved,
        attempts: state.attempts,
        chapter: state.chapter,
        index: state.index
      }));
    } catch (err) {
      /* quota ou mode privé : on ignore silencieusement */
    }
  }

  /* ------------------------------------------------------------- correction */

  function stripDelimiters(raw) {
    var src = String(raw || '').trim();
    if (!src) return '';
    var slashed = src.match(/^\/([\s\S]*)\/([a-z]*)$/);
    if (slashed) return slashed[1];
    return src;
  }

  function build(source, flags) {
    if (!source) throw new Error('expression vide');
    return new RegExp(source, flags || '');
  }

  function evaluate(exercise, source) {
    var result = { valid: false, error: '', cases: [], extract: null };

    var regex;
    try {
      regex = build(source, '');
    } catch (err) {
      result.error = err.message;
      return result;
    }

    var allOk = true;

    if (exercise.tests) {
      exercise.tests.forEach(function (test) {
        var got = regex.test(test.input);
        var pass = got === test.ok;
        if (!pass) allOk = false;
        result.cases.push({
          input: test.input,
          expected: test.ok,
          got: got,
          pass: pass
        });
      });
    }

    if (exercise.extract) {
      var matches = [];
      var scanError = '';
      try {
        var globalRegex = build(source, 'g');
        var found = exercise.extract.input.matchAll(globalRegex);
        var groupIndex = exercise.extract.group || 0;
        for (var m of found) {
          var value = m[groupIndex];
          matches.push(value === undefined ? '' : value);
        }
      } catch (err) {
        scanError = err.message;
      }

      var expected = exercise.extract.expected;
      var same = matches.length === expected.length && matches.every(function (value, i) {
        return value === expected[i];
      });
      if (!same) allOk = false;
      result.extract = {
        input: exercise.extract.input,
        expected: expected,
        matches: matches,
        pass: same,
        error: scanError,
        group: exercise.extract.group || 0
      };
    }

    if (exercise.probe) {
      var probeMatch = regex.exec(exercise.probe.input);
      if (!probeMatch) {
        allOk = false;
        result.probe = { pass: false, message: 'ton motif ne matche pas la chaîne témoin du contrôle structurel' };
      } else {
        var groupCount = probeMatch.length - 1;
        if (groupCount > exercise.probe.maxGroups) {
          allOk = false;
          result.probe = {
            pass: false,
            message: 'ton motif crée ' + groupCount + (groupCount > 1 ? ' groupes de capture' : ' groupe de capture') + ', alors qu\u2019il n\u2019en faut aucun'
          };
        } else {
          result.probe = { pass: true, groups: groupCount };
        }
      }
    }

    result.valid = allOk;
    return result;
  }

  function highlightMatches(text, source) {
    var safe = escapeHtml(text);
    if (!source) return safe;
    var matches;
    try {
      matches = Array.from(text.matchAll(build(source, 'g')));
    } catch (err) {
      return safe;
    }
    if (!matches.length) return safe;

    var out = '';
    var cursor = 0;
    matches.forEach(function (match) {
      if (match[0] === '') return;
      var start = match.index;
      var end = start + match[0].length;
      out += escapeHtml(text.slice(cursor, start));
      out += '<mark>' + escapeHtml(match[0]) + '</mark>';
      cursor = end;
    });
    out += escapeHtml(text.slice(cursor));
    return out;
  }

  /* ------------------------------------------------------------------ render */

  function renderChapters() {
    dom.chapters.innerHTML = CHAPTERS.map(function (chapter, i) {
      var done = chapter.exercises.filter(function (ex) { return state.solved[ex.id]; }).length;
      var current = i === state.chapter ? 'true' : 'false';
      return '<button class="chip" type="button" data-chapter="' + i + '" aria-current="' + current + '">' +
        '<span>' + escapeHtml(chapter.title) + '</span>' +
        '<span class="chip-count">' + done + '/' + chapter.exercises.length + '</span>' +
        '</button>';
    }).join('');
  }

  function renderProgress() {
    var solved = Object.keys(state.solved).length;
    var total = totalExercises();
    dom.progressLabel.textContent = solved + ' / ' + total;
    dom.progressFill.style.width = total ? ((solved / total) * 100) + '%' : '0%';
    dom.progressTrack.setAttribute('aria-valuenow', String(solved));
    dom.progressTrack.setAttribute('aria-valuemax', String(total));
    dom.progressTrack.setAttribute('aria-label', 'Exercices résolus');
  }

  function currentChapter() {
    return CHAPTERS[state.chapter];
  }

  function currentExercise() {
    return currentChapter().exercises[state.index];
  }

  function renderCard() {
    var chapter = currentChapter();
    var ex = currentExercise();
    var isSolved = Boolean(state.solved[ex.id]);
    var attempts = state.attempts[ex.id] || 0;

    var bench;
    if (ex.extract) {
      bench =
        '<div class="bench">' +
          '<div class="bench-head">' +
            '<span class="bench-title">Texte à fouiller</span>' +
            '<span class="bench-verdict" id="verdict">' + (isSolved ? 'résolu' : 'en attente') + '</span>' +
          '</div>' +
          '<div class="extract-block">' +
            '<p class="extract-text" id="extract-text">' + escapeHtml(ex.extract.input) + '</p>' +
            '<p class="extract-expected">Attendu : ' +
              ex.extract.expected.map(function (value) {
                return '<span class="case">' + escapeHtml(value) + '</span>';
              }).join(' ') +
            '</p>' +
            '<p class="extract-expected" id="extract-got">Obtenu : <span class="case">—</span></p>' +
          '</div>' +
        '</div>';
    } else {
      bench =
        '<div class="bench">' +
          '<div class="bench-head">' +
            '<span class="bench-title">Banc de tests</span>' +
            '<span class="bench-verdict" id="verdict">' + (isSolved ? 'résolu' : 'en attente') + '</span>' +
          '</div>' +
          '<ul class="cases" id="cases">' +
            ex.tests.map(function (test) {
              return '<li class="case" data-input="' + escapeHtml(test.input) + '">' +
                (test.input === '' ? '(chaîne vide)' : escapeHtml(test.input)) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>';
    }

    dom.card.innerHTML =
      '<div class="card-head">' +
        '<div>' +
          '<p class="eyebrow">' + escapeHtml(chapter.title) + ' · exercice ' + (state.index + 1) + '/' + chapter.exercises.length + '</p>' +
          '<h2 class="ex-title" id="ex-title">' + escapeHtml(ex.title) + '</h2>' +
        '</div>' +
        (isSolved ? '<span class="solved-flag">résolu</span>' : '') +
      '</div>' +
      '<p class="ex-prompt">' + escapeHtml(ex.prompt) + '</p>' +
      '<p class="ex-hint">Indice : ' + escapeHtml(ex.hint) + '</p>' +
      '<label class="sr-only" for="answer">Ta regex pour « ' + escapeHtml(ex.title) + ' »</label>' +
      '<div class="field" id="field">' +
        '<span class="delim" aria-hidden="true">/</span>' +
        '<input id="answer" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + escapeHtml(ex.solution ? '' : '') + 'ta regex ici">' +
        '<span class="delim" aria-hidden="true">/g</span>' +
      '</div>' +
      bench +
      '<p class="feedback" id="feedback" role="status" aria-live="polite"></p>' +
      '<div id="solution-slot"></div>' +
      '<div class="actions">' +
        '<button class="btn btn-primary" type="button" id="check">Vérifier <kbd>⏎</kbd></button>' +
        '<button class="btn btn-ghost" type="button" id="reveal">Voir la solution</button>' +
      '</div>' +
      '<div class="pager">' +
        '<button class="btn btn-ghost" type="button" id="prev"' + (state.index === 0 ? ' disabled' : '') + '>← Précédent</button>' +
        '<button class="btn btn-ghost" type="button" id="next"' + (state.index === chapter.exercises.length - 1 ? ' disabled' : '') + '>Suivant →</button>' +
      '</div>';

    dom.answer = document.getElementById('answer');
    dom.field = document.getElementById('field');
    dom.feedback = document.getElementById('feedback');
    dom.verdict = document.getElementById('verdict');
    dom.solutionSlot = document.getElementById('solution-slot');

    if (ex.extract) {
      dom.extractText = document.getElementById('extract-text');
      dom.extractGot = document.getElementById('extract-got');
    } else {
      dom.cases = document.getElementById('cases');
    }

    dom.answer.addEventListener('input', onInput);
    dom.answer.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        validate(true);
      }
    });
    document.getElementById('check').addEventListener('click', function () { validate(true); });
    document.getElementById('reveal').addEventListener('click', revealSolution);
    document.getElementById('prev').addEventListener('click', function () { go(-1); });
    document.getElementById('next').addEventListener('click', function () { go(1); });

    if (attempts >= REVEAL_AFTER && !isSolved) {
      showFeedback('Plusieurs essais déjà. La solution reste accessible si tu bloques.', 'is-info');
    }

    dom.answer.focus({ preventScroll: true });
    renderProgress();
    renderChapters();
  }

  function renderCandidate(result) {
    var ex = currentExercise();

    if (ex.extract) {
      if (result.extract.error) {
        dom.extractGot.innerHTML = 'Obtenu : <span class="case">erreur de syntaxe</span>';
        dom.extractText.innerHTML = escapeHtml(ex.extract.input);
        return;
      }
      dom.extractText.innerHTML = highlightMatches(ex.extract.input, result.extract.matches.length ? stripDelimiters(dom.answer.value) : '');
      dom.extractGot.innerHTML = 'Obtenu : ' + (result.extract.matches.length
        ? result.extract.matches.map(function (value) {
            return '<span class="case' + (result.extract.pass ? ' is-ok' : '') + '">' + escapeHtml(value) + '</span>';
          }).join(' ')
        : '<span class="case">aucun match</span>');
      return;
    }

    var items = dom.cases.querySelectorAll('.case');
    result.cases.forEach(function (item, i) {
      var node = items[i];
      if (!node) return;
      node.classList.toggle('is-ok', item.pass);
      node.classList.toggle('is-bad', !item.pass && Boolean(stripDelimiters(dom.answer.value)));
    });
  }

  function onInput() {
    var ex = currentExercise();
    var source = stripDelimiters(dom.answer.value);
    dom.field.classList.remove('is-ok', 'is-bad');

    if (!source) {
      if (dom.cases) {
        dom.cases.querySelectorAll('.case').forEach(function (node) {
          node.classList.remove('is-ok', 'is-bad');
        });
      }
      if (dom.extractText) dom.extractText.innerHTML = escapeHtml(ex.extract.input);
      if (dom.extractGot) dom.extractGot.innerHTML = 'Obtenu : <span class="case">—</span>';
      dom.verdict.textContent = state.solved[ex.id] ? 'résolu' : 'en attente';
      showFeedback('', '');
      return;
    }

    var result = evaluate(ex, source);
    if (!result.valid) {
      renderCandidate(result);
      dom.verdict.textContent = 'en cours';
    } else {
      renderCandidate(result);
      dom.field.classList.add('is-ok');
      dom.verdict.textContent = 'valide';
    }
  }

  function showFeedback(text, className) {
    dom.feedback.textContent = text;
    dom.feedback.className = 'feedback' + (className ? ' ' + className : '');
  }

  function validate() {
    var ex = currentExercise();
    var source = stripDelimiters(dom.answer.value);

    if (!source) {
      showFeedback('Saisis une expression avant de vérifier.', 'is-bad');
      dom.answer.focus();
      return;
    }

    state.attempts[ex.id] = (state.attempts[ex.id] || 0) + 1;
    var result = evaluate(ex, source);
    renderCandidate(result);

    if (result.error) {
      dom.field.classList.remove('is-ok');
      dom.field.classList.add('is-bad');
      showFeedback('Syntaxe refusée par le moteur : ' + result.error, 'is-bad');
      save();
      return;
    }

    if (result.valid) {
      dom.field.classList.add('is-ok');
      dom.field.classList.remove('is-bad');
      state.solved[ex.id] = true;
      dom.verdict.textContent = 'valide';
      var attempts = state.attempts[ex.id];
      showFeedback('Correct. Tous les cas passent' + (attempts === 1 ? ' du premier coup.' : ' (' + attempts + ' essais).'), 'is-ok');
      save();
      renderProgress();
      renderChapters();
      var flag = dom.card.querySelector('.solved-flag');
      if (!flag) {
        var head = dom.card.querySelector('.card-head');
        var badge = document.createElement('span');
        badge.className = 'solved-flag';
        badge.textContent = 'résolu';
        head.appendChild(badge);
      }
    } else {
      dom.field.classList.add('is-bad');
      dom.field.classList.remove('is-ok');
      dom.verdict.textContent = 'faux';
      if (result.probe && !result.probe.pass) {
        showFeedback('Les cas passent, mais ' + result.probe.message + '.', 'is-bad');
      } else if (state.attempts[ex.id] >= REVEAL_AFTER) {
        showFeedback('Trois essais. Regarde le case rouge, ou ouvre la solution.', 'is-info');
      } else {
        showFeedback('Pas encore. Repère le cas qui casse et corrige le motif.', 'is-bad');
      }
      save();
    }
  }

  function revealSolution() {
    var ex = currentExercise();
    dom.solutionSlot.innerHTML = '<p class="solution">Solution : <strong>/' +
      escapeHtml(ex.solution) + '/g</strong></p>';
    dom.answer.value = ex.solution;
    dom.answer.focus();
    onInput();
  }

  function go(delta) {
    var chapter = currentChapter();
    var next = state.index + delta;
    if (next < 0 || next >= chapter.exercises.length) return;
    state.index = next;
    save();
    renderCard();
  }

  function goChapter(index) {
    if (index < 0 || index >= CHAPTERS.length) return;
    state.chapter = index;
    state.index = 0;
    save();
    renderCard();
  }

  /* ------------------------------------------------------------------- boot */

  function boot() {
    dom.chapters = document.getElementById('chapters');
    dom.card = document.getElementById('card');
    dom.progressLabel = document.getElementById('progress-label');
    dom.progressFill = document.getElementById('progress-fill');
    dom.progressTrack = document.querySelector('.progress-track');

    if (!CHAPTERS.length) {
      dom.card.innerHTML = '<p>Données d\u2019exercices introuvables.</p>';
      return;
    }

    load();

    dom.chapters.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-chapter]');
      if (!chip) return;
      goChapter(Number(chip.dataset.chapter));
    });

    document.getElementById('reset').addEventListener('click', function () {
      state.solved = {};
      state.attempts = {};
      save();
      renderCard();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' && event.altKey) { go(1); }
      if (event.key === 'ArrowLeft' && event.altKey) { go(-1); }
    });

    /* Le changement d'onglet est piloté par la vue Cours : on se re-rend
       à chaque bascule, même si l'ordre de chargement des scripts varie. */
    document.addEventListener('nero:mode', function () {
      renderCard();
      renderProgress();
    });

    renderCard();
    renderProgress();

    window.__drills = {
      refresh: function () {
        renderCard();
        renderProgress();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
