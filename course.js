/* Cours — Regex Drills
   Parcours progressif depuis zéro : 9 leçons, exemples exécutés en vrai dans le navigateur,
   et un mini-contrôle par leçon corrigé par le moteur RegExp (jamais par comparaison de texte).

   Convention d'écriture : le caractère § remplace l'antislash dans toutes les données ci-dessous.
   normalize() le convertit au chargement. Ça évite de se battre avec les échappements. */

(function () {
  'use strict';

  var RAW = [
    {
      id: 'l1',
      title: 'Une regex, c\u2019est quoi',
      tagline: 'Le concept avant la syntaxe',
      goal: 'Comprendre à quoi sert une regex et savoir lire la forme /motif/flags.',
      blocks: [
        { type: 'p', text: 'Une expression régulière (regex) est un motif de texte. Tu l\u2019écris une fois, et un moteur de recherche le compare à des chaînes pour répondre à deux questions : est-ce que ça correspond, et à quel endroit ?' },
        { type: 'p', text: 'Ce n\u2019est pas un langage de programmation. C\u2019est une notation, courte et dense, qui décrit une forme. C\u2019est pour ça qu\u2019elle paraît illisible au début : on lit des symboles, pas des mots.' },
        { type: 'tokens', title: 'Anatomie d\u2019une regex', items: [
          { token: '/', role: 'délimiteur : une convention d\u2019écriture, pas une partie du motif', example: '/chat/' },
          { token: 'chat', role: 'le motif lui-même', example: '/chat/' },
          { token: 'g', role: 'flag global : trouve toutes les occurrences, pas seulement la première', example: '/chat/g' },
          { token: 'i', role: 'flag insensitive : ignore la casse', example: '/chat/i' }
        ] },
        { type: 'demo', label: 'Le motif chat dans une phrase', pattern: 'chat', sample: 'Le chat dort. Un chaton joue. Chat.' },
        { type: 'note', text: 'Deux zones surlignées, et le « chaton » est dedans. Une regex trouve des formes, pas des mots. Et « Chat » avec une majuscule n\u2019est pas trouvé : sans le flag i, la casse compte.' },
        { type: 'p', text: 'Point clé : par défaut, un motif n\u2019a pas besoin de décrire toute la chaîne. Il matche n\u2019importe où à l\u2019intérieur. Si tu veux toute la chaîne, il faudra les ancres (leçon 5).' },
        { type: 'pitfall', text: 'Erreur classique du débutant : écrire un motif énorme qui décrit la chaîne entière. Commence petit, teste, puis ajoute des contraintes une par une.' }
      ]
    },
    {
      id: 'l2',
      title: 'Littéral et joker',
      tagline: 'Les caractères qui se matchent eux-mêmes',
      goal: 'Écrire un motif avec des caractères littéraux, puis utiliser le point.',
      blocks: [
        { type: 'p', text: 'La majorité des caractères n\u2019ont aucun pouvoir spécial : a, B, 7, é se matchent eux-mêmes. Un motif abc cherche la suite exacte de trois lettres.' },
        { type: 'tokens', title: 'Les deux symboles de base', items: [
          { token: 'abc', role: 'la suite exacte : a puis b puis c', example: 'abc' },
          { token: '.', role: 'n\u2019importe quel caractère, sauf un retour à la ligne', example: 'a.c' },
          { token: '§.', role: 'un point littéral : l\u2019antislash annule le pouvoir du point', example: 'a§.c' }
        ] },
        { type: 'demo', label: 'a.c : le point avale un caractère', pattern: 'a.c', sample: 'abc aXc a c ac' },
        { type: 'demo', label: 'a§.c : le point redevient un point', pattern: 'a§.c', sample: 'abc aXc a.c ac' },
        { type: 'pitfall', text: 'Le point ne veut pas dire « n\u2019importe quoi ». Il veut dire exactement un caractère : ni zéro, ni deux. Pour plusieurs, il faut un quantificateur (leçon 4).' },
        { type: 'note', text: 'L\u2019antislash transforme un caractère spécial en caractère littéral. C\u2019est le même geste qui fabrique les classes comme §d, vue à la leçon suivante.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche abc suivi d\u2019exactement un caractère quelconque.',
        hint: 'Trois lettres, puis un signe qui avale un caractère.',
        solution: 'abc.',
        tests: [
          { input: 'abcd', ok: true },
          { input: 'abc ', ok: true },
          { input: 'abc', ok: false }
        ]
      }
    },
    {
      id: 'l3',
      title: 'Classes de caractères',
      tagline: 'Un emplacement, plusieurs caractères possibles',
      goal: 'Choisir un ensemble de caractères avec les crochets, les plages, et les raccourcis §d §w §s.',
      blocks: [
        { type: 'p', text: 'Les crochets créent un ensemble : un seul emplacement dans la chaîne, mais plusieurs caractères possibles. [aeiou] matche une voyelle, une seule.' },
        { type: 'tokens', title: 'Classes et raccourcis', items: [
          { token: '[abc]', role: 'a, ou b, ou c : un seul caractère', example: '[abc]at' },
          { token: '[a-z]', role: 'une plage : n\u2019importe quelle minuscule', example: '[a-z]' },
          { token: '[A-Z0-9]', role: 'plusieurs plages dans la même classe', example: '[A-Z0-9]' },
          { token: '[^abc]', role: 'négation : tout sauf a, b ou c', example: '[^0-9]' },
          { token: '§d', role: 'raccourci de [0-9]', example: '§d' },
          { token: '§w', role: 'lettre, chiffre ou underscore', example: '§w' },
          { token: '§s', role: 'espace, tabulation, retour à la ligne', example: '§s' },
          { token: '§D §W §S', role: 'la négation des trois précédents', example: '§D' }
        ] },
        { type: 'demo', label: '§d+ : les nombres d\u2019une phrase', pattern: '§d+', sample: 'Commande 4021 livrée en 3 colis le 12/11.' },
        { type: 'demo', label: '[aeiouy] : une voyelle à la fois', pattern: '[aeiouy]', sample: 'le petit chat boit du lait' },
        { type: 'pitfall', text: 'Dans les crochets, la plupart des symboles perdent leur pouvoir : [.] est un point littéral, pas un joker. Et un ^ en tête inverse la classe, mais ailleurs dans les crochets c\u2019est un simple chapeau.' },
        { type: 'note', text: '§w ne matche pas é en JavaScript : les raccourcis sont limités à l\u2019ASCII. Pour du texte français accentué, écris la classe à la main.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche un seul caractère, à condition que ce soit une voyelle minuscule.',
        hint: 'Des crochets contenant les voyelles.',
        solution: '[aeiouy]',
        tests: [
          { input: 'e', ok: true },
          { input: 'y', ok: true },
          { input: 'z', ok: false },
          { input: 'E', ok: false }
        ]
      }
    },
    {
      id: 'l4',
      title: 'Quantificateurs',
      tagline: 'Combien de fois, ce caractère',
      goal: 'Dire zéro ou plus, un ou plus, exactement n fois.',
      blocks: [
        { type: 'p', text: 'Un quantificateur s\u2019applique au caractère ou au groupe qui le précède immédiatement. C\u2019est la source d\u2019erreur numéro un : ab* signifie « un a suivi de zéro ou plusieurs b », pas « zéro ou plusieurs ab ».' },
        { type: 'tokens', title: 'Les cinq formes', items: [
          { token: '*', role: 'zéro fois ou plus', example: 'ab*' },
          { token: '+', role: 'une fois ou plus', example: 'ab+' },
          { token: '?', role: 'zéro ou une fois, donc facultatif', example: 'colou?r' },
          { token: '{3}', role: 'exactement trois fois', example: '§d{3}' },
          { token: '{2,4}', role: 'entre deux et quatre fois', example: '§d{2,4}' },
          { token: '{2,}', role: 'au moins deux fois, sans limite haute', example: '§d{2,}' }
        ] },
        { type: 'demo', label: 'colou?r : le u devient facultatif', pattern: 'colou?r', sample: 'color colour colouur' },
        { type: 'demo', label: 'ab* : le b est facultatif', pattern: 'ab*', sample: 'a ab abb abbb' },
        { type: 'demo', label: 'ab+ : le b devient obligatoire', pattern: 'ab+', sample: 'a ab abb abbb' },
        { type: 'pitfall', text: '* et ? acceptent zéro, donc ils peuvent matcher une chaîne vide. Un motif qui matche du vide donne des résultats surprenants dans une boucle : c\u2019est le fameux match vide.' },
        { type: 'note', text: 'Le trio à retenir : * = 0 ou plus, + = 1 ou plus, ? = 0 ou 1. Le reste, les accolades, n\u2019est que du réglage fin.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche un nombre de 2 à 4 chiffres.',
        hint: 'Une classe de chiffres, puis des accolades.',
        solution: '§d{2,4}',
        tests: [
          { input: '12', ok: true },
          { input: '1234', ok: true },
          { input: '1', ok: false },
          { input: 'abc', ok: false }
        ]
      }
    },
    {
      id: 'l5',
      title: 'Ancres et frontières',
      tagline: 'Contraindre la position',
      goal: 'Exiger que le motif couvre toute la chaîne, ou qu\u2019il s\u2019arrête à un mot entier.',
      blocks: [
        { type: 'p', text: 'Une ancre ne consomme aucun caractère : elle décrit une position. ^ veut dire « ici commence la chaîne », $ veut dire « ici elle finit ». C\u2019est ce qui transforme « contient » en « est exactement ».' },
        { type: 'tokens', title: 'Ancres et frontières', items: [
          { token: '^', role: 'début de la chaîne, ou début de ligne avec le flag m', example: '^§d' },
          { token: '$', role: 'fin de la chaîne, ou fin de ligne avec le flag m', example: '§d$' },
          { token: '^...$', role: 'la chaîne entière doit correspondre au motif', example: '^§d{5}$' },
          { token: '§b', role: 'frontière de mot : la limite entre §w et non-§w', example: '§bchat§b' }
        ] },
        { type: 'demo', label: 'Sans ancre : le motif passe n\u2019importe où', pattern: '§d{5}', sample: '80000 Amiens, code 80000x' },
        { type: 'demo', label: 'Avec ancres : la chaîne entière doit être un code postal', pattern: '^§d{5}$', sample: '80000' },
        { type: 'demo', label: '§bchat§b : le mot entier seulement', pattern: '§bchat§b', sample: 'Le chat dort. Un chaton joue.' },
        { type: 'pitfall', text: '^ et $ ne veulent pas dire début et fin de chaque ligne par défaut : elles collent aux extrémités de la chaîne. Pour un comportement ligne par ligne, il faut le flag m.' },
        { type: 'note', text: 'Règle pratique : dès qu\u2019il s\u2019agit de valider une saisie (code postal, numéro, mot de passe), encadre avec ^ et $. Sans ça, abc passe sans problème dans xxabcxx.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche un code postal français : exactement 5 chiffres, du début à la fin, rien d\u2019autre.',
        hint: 'Deux ancres et un quantificateur exact.',
        solution: '^§d{5}$',
        tests: [
          { input: '80000', ok: true },
          { input: '8000', ok: false },
          { input: '800000', ok: false },
          { input: 'a8000', ok: false }
        ]
      }
    },
    {
      id: 'l6',
      title: 'Groupes et alternative',
      tagline: 'Regrouper pour répéter, ou pour choisir',
      goal: 'Utiliser les parenthèses pour appliquer un quantificateur à un bloc, et écrire un ou.',
      blocks: [
        { type: 'p', text: 'Les parenthèses font deux choses : elles regroupent (pour appliquer un quantificateur à plusieurs caractères) et elles choisissent avec la barre verticale. Sans parenthèses, le quantificateur ne porte que sur le dernier caractère.' },
        { type: 'tokens', title: 'Groupes et alternative', items: [
          { token: '(ab)+', role: 'le bloc ab, une ou plusieurs fois', example: '(ab)+' },
          { token: 'chat|chien', role: 'chat ou chien', example: 'chat|chien' },
          { token: '(chat|chien)s?', role: 'un ou quantifié, avec un s facultatif', example: '(chat|chien)s?' },
          { token: '(?:...)', role: 'groupe non capturant : regrouper sans rien mémoriser', example: '(?:ab)+' }
        ] },
        { type: 'demo', label: 'chat|chien : deux formes acceptées', pattern: 'chat|chien', sample: 'un chat, deux chiens, trois chats' },
        { type: 'demo', label: '(chat|chien)s? : le pluriel rentre aussi', pattern: '(chat|chien)s?', sample: 'un chat, deux chiens, trois chats' },
        { type: 'pitfall', text: 'ab|cd veut dire « ab » ou « cd », pas « a(b ou c)d ». L\u2019alternative a la priorité la plus faible de toute la notation. Encadre dès que tu hésites : a(b|c)d.' },
        { type: 'note', text: 'En JavaScript, matchAll avec le flag g te donne tous les blocs trouvés. C\u2019est exactement le mécanisme qui corrige les exercices de ce site.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche le mot rouge, ou vert, ou bleu.',
        hint: 'Deux barres verticales suffisent.',
        solution: 'rouge|vert|bleu',
        tests: [
          { input: 'rouge', ok: true },
          { input: 'vert', ok: true },
          { input: 'bleu', ok: true },
          { input: 'jaune', ok: false }
        ]
      }
    },
    {
      id: 'l7',
      title: 'Capturer',
      tagline: 'Sortir un morceau du match',
      goal: 'Récupérer un morceau précis du texte trouvé grâce aux groupes de capture.',
      blocks: [
        { type: 'p', text: 'Quand une parenthèse sert à choisir ou à répéter, elle capture aussi ce qu\u2019elle contient. Le moteur rend le match complet en position 0, puis chaque groupe dans l\u2019ordre d\u2019ouverture des parenthèses.' },
        { type: 'tokens', title: 'Capture', items: [
          { token: '(§d{2})/(§d{2})/(§d{4})', role: 'trois groupes : jour, mois, année', example: '14/03/2027' },
          { token: 'm[0]', role: 'le match complet', example: '14/03/2027' },
          { token: 'm[1]', role: 'le premier groupe', example: '14' },
          { token: 'm[3]', role: 'le troisième groupe', example: '2027' },
          { token: '(?:§d{2})', role: 'parenthèse non capturante : regroupe sans créer de groupe', example: '(?:§d{2})/' }
        ] },
        { type: 'demo', label: 'Extraction jour, mois, année', pattern: '(§d{2})/(§d{2})/(§d{4})', sample: 'Réunion le 14/03/2027, puis le 02/11/2026.', groups: true },
        { type: 'pitfall', text: 'Chaque paire de parenthèses crée un groupe, même invisible. Dans un motif comme ^(ab)+$, la parenthèse crée un groupe que tu n\u2019as jamais demandé. Réflexe : (?:...) quand tu regroupes sans vouloir capturer.' },
        { type: 'note', text: 'En remplacement, on réutilise les groupes avec $1, $2. Remplacer (§d{2})/(§d{2})/(§d{4}) par $3-$2-$1 transforme 14/03/2027 en 2027-03-14.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche un nom de fichier avec extension, et capture le nom sans l\u2019extension ni le point.',
        hint: 'Un groupe autour du nom, puis un point échappé et l\u2019extension.',
        solution: '^(§w+)§.§w+$',
        extract: { input: 'rapport.pdf', expected: ['rapport'], group: 1 },
        tests: [
          { input: 'rapport.pdf', ok: true },
          { input: 'rapport', ok: false }
        ]
      }
    },
    {
      id: 'l8',
      title: 'Gourmandise et lookarounds',
      tagline: 'Le niveau qui débloque tout le reste',
      goal: 'Comprendre pourquoi un quantificateur en avale trop, et contraindre un motif par son contexte.',
      blocks: [
        { type: 'p', text: 'Par défaut un quantificateur est gourmand : il prend le maximum possible, puis recule si nécessaire. C\u2019est pour ça que .* sur du HTML avale toute la page au lieu de s\u2019arrêter à la première balise fermante.' },
        { type: 'tokens', title: 'Les corrections', items: [
          { token: '*?', role: 'paresseux : prend le minimum possible', example: '<.*?>' },
          { token: '[^"]*', role: 'classe négative : avance jusqu\u2019au délimiteur, sans jamais le franchir', example: '"[^"]*"' },
          { token: '(?=...)', role: 'lookahead : exige que la suite corresponde, sans la consommer', example: '§d+(?= ?€)' },
          { token: '(?<=...)', role: 'lookbehind : exige que ce qui précède corresponde', example: '(?<=Prix : )§d+' },
          { token: '(?!...)', role: 'lookahead négatif : exige que la suite NE corresponde PAS', example: '§d+(?! ?€)' }
        ] },
        { type: 'demo', label: 'Gourmand : il prend tout d\u2019un coup', pattern: '<.*>', sample: '<b>gras</b> puis <i>italique</i>' },
        { type: 'demo', label: 'Paresseux : il s\u2019arrête à la première occasion', pattern: '<.*?>', sample: '<b>gras</b> puis <i>italique</i>' },
        { type: 'demo', label: 'Classe négative : la version la plus lisible', pattern: '<[^>]*>', sample: '<b>gras</b> puis <i>italique</i>' },
        { type: 'pitfall', text: 'Le réflexe .* est le plus mauvais réflexe du débutant. Si tu connais le caractère d\u2019arrêt, décris-le avec une classe négative : c\u2019est plus lisible et plus rapide qu\u2019un paresseux.' },
        { type: 'note', text: 'Les lookarounds ne consomment rien : ils disent « à condition que ». C\u2019est ce qui permet de capturer un prix sans capturer le symbole euro qui le suit.' }
      ],
      check: {
        prompt: 'Écris un motif qui matche un texte entre guillemets, guillemets compris.',
        hint: 'Un guillemet, une classe qui refuse le guillemet, puis rien ou plusieurs fois.',
        solution: '"[^"]*"',
        tests: [
          { input: '"bonjour"', ok: true },
          { input: 'bonjour', ok: false }
        ]
      }
    },
    {
      id: 'l9',
      title: 'Mémo et méthode',
      tagline: 'La référence à garder ouverte',
      goal: 'Avoir la table complète sous la main et une méthode de travail qui évite les impasses.',
      blocks: [
        { type: 'p', text: 'Voilà toute la notation dont tu as besoin pour 95 % des cas réels. Le reste est du confort.' },
        { type: 'tokens', title: 'Référence', items: [
          { token: '.', role: 'un caractère quelconque', example: 'a.c' },
          { token: '§.', role: 'un point littéral', example: 'a§.c' },
          { token: '[abc]', role: 'un caractère parmi ceux-là', example: '[abc]' },
          { token: '[^abc]', role: 'un caractère sauf ceux-là', example: '[^abc]' },
          { token: '[a-z]', role: 'une plage', example: '[a-z]' },
          { token: '§d §w §s', role: 'chiffre, mot, espace', example: '§d' },
          { token: '* + ?', role: '0+, 1+, 0 ou 1', example: 'ab+' },
          { token: '{n} {n,m}', role: 'exactement n, ou entre n et m', example: '§d{2,4}' },
          { token: '*? +?', role: 'versions paresseuses', example: '<.*?>' },
          { token: '^ $', role: 'début et fin de chaîne', example: '^abc$' },
          { token: '§b', role: 'frontière de mot', example: '§bchat§b' },
          { token: '( )', role: 'groupe : regrouper et capturer', example: '(ab)+' },
          { token: '(?: )', role: 'groupe non capturant', example: '(?:ab)+' },
          { token: '|', role: 'alternative', example: 'chat|chien' },
          { token: '(?= ) (?! )', role: 'lookahead positif ou négatif', example: '§d+(?! ?€)' }
        ] },
        { type: 'steps', title: 'Méthode de travail', items: [
          'Écris d\u2019abord en français ce que tu cherches : « cinq chiffres, du début à la fin ».',
          'Traduis chaque morceau de la phrase en un seul symbole. Cinq → {5}, chiffres → §d, du début à la fin → ^ et $.',
          'Teste sur une chaîne qui DOIT matcher, puis sur une qui doit échouer. Une regex qui n\u2019a jamais échoué n\u2019a pas été testée.',
          'Ajoute les cas limites un par un : chaîne vide, accents, majuscules, espaces en trop.',
          'Si tu ne comprends pas ton propre motif, simplifie-le. Une regex illisible est une regex fausse en attente.'
        ] },
        { type: 'note', text: 'Maintenant va dans l\u2019onglet Exercices. Les 30 drills sont classés dans le même ordre que ces leçons : si tu bloques sur un chapitre, relis la leçon correspondante.' }
      ]
    }
  ];

  /* ------------------------------------------------------------------ outils */

  var BACKSLASH = String.fromCharCode(92);
  var STORE_KEY = 'nero-regex-course-v1';
  var MODE_KEY = 'nero-regex-mode-v1';

  function normalize(node) {
    if (typeof node === 'string') return node.split('\u00a7').join(BACKSLASH);
    if (Array.isArray(node)) return node.map(normalize);
    if (node && typeof node === 'object') {
      var out = {};
      Object.keys(node).forEach(function (key) { out[key] = normalize(node[key]); });
      return out;
    }
    return node;
  }

  var LESSONS = normalize(RAW);

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (ch) { return ESCAPES[ch]; });
  }

  function fmt(text) {
    return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function build(source, flags) {
    if (!source) throw new Error('expression vide');
    return new RegExp(source, flags || '');
  }

  function highlight(text, source, flags) {
    var safe = escapeHtml(text);
    var re;
    try {
      re = build(source, (flags || 'g'));
    } catch (err) {
      return safe;
    }
    var out = '';
    var cursor = 0;
    var match;
    var guard = 0;
    while ((match = re.exec(text)) !== null) {
      if (guard++ > 5000) break;
      if (match[0] === '') { re.lastIndex += 1; continue; }
      var start = match.index;
      var end = start + match[0].length;
      out += escapeHtml(text.slice(cursor, start));
      out += '<mark>' + escapeHtml(match[0]) + '</mark>';
      cursor = end;
    }
    out += escapeHtml(text.slice(cursor));
    return out;
  }

  /* ------------------------------------------------------------------- état */

  var state = { index: 0, done: {} };

  function loadCourse() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      state.done = parsed.done || {};
      state.index = Math.min(Math.max(parsed.index || 0, 0), LESSONS.length - 1);
    } catch (err) { /* stockage indisponible */ }
  }

  function saveCourse() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ done: state.done, index: state.index }));
    } catch (err) { /* quota ou navigation privée */ }
  }

  /* ---------------------------------------------------------------- rendu */

  var dom = {};

  function renderLessonNav() {
    dom.lessons.innerHTML = LESSONS.map(function (lesson, i) {
      var current = i === state.index ? 'true' : 'false';
      var mark = state.done[lesson.id] ? '\u2713' : String(i + 1);
      return '<button class="chip lesson-chip" type="button" data-lesson="' + i + '" aria-current="' + current + '">' +
        '<span class="chip-num">' + mark + '</span>' +
        '<span>' + escapeHtml(lesson.title) + '</span>' +
        '</button>';
    }).join('');
  }

  function renderCourseProgress() {
    if (!dom.progressLabel) return;
    var done = Object.keys(state.done).length;
    dom.progressLabel.textContent = done + ' / ' + LESSONS.length + ' leçons';
    if (dom.progressFill) dom.progressFill.style.width = ((done / LESSONS.length) * 100) + '%';
    if (dom.progressTrack) {
      dom.progressTrack.setAttribute('aria-valuenow', String(done));
      dom.progressTrack.setAttribute('aria-valuemax', String(LESSONS.length));
      dom.progressTrack.setAttribute('aria-label', 'Leçons terminées');
    }
  }

  function blockHtml(block) {
    if (block.type === 'p') {
      return '<p class="lesson-p">' + fmt(block.text) + '</p>';
    }

    if (block.type === 'note') {
      return '<p class="lesson-note">' + fmt(block.text) + '</p>';
    }

    if (block.type === 'pitfall') {
      return '<div class="pitfall"><span class="pitfall-tag">Piège</span><p>' + fmt(block.text) + '</p></div>';
    }

    if (block.type === 'tokens') {
      var rows = block.items.map(function (item) {
        return '<li class="token-row">' +
          '<code class="token">' + escapeHtml(item.token) + '</code>' +
          '<span class="token-role">' + fmt(item.role) + '</span>' +
          '</li>';
      }).join('');
      return '<div class="tokens">' +
        (block.title ? '<p class="tokens-title">' + escapeHtml(block.title) + '</p>' : '') +
        '<ul class="token-list">' + rows + '</ul>' +
        '</div>';
    }

    if (block.type === 'steps') {
      return '<div class="tokens">' +
        (block.title ? '<p class="tokens-title">' + escapeHtml(block.title) + '</p>' : '') +
        '<ol class="step-list">' + block.items.map(function (item) {
          return '<li>' + fmt(item) + '</li>';
        }).join('') + '</ol>' +
        '</div>';
    }

    if (block.type === 'demo') {
      var groups = '';
      if (block.groups) {
        var found;
        try {
          var probe = build(block.pattern, '');
          found = probe.exec(block.sample);
        } catch (err) { found = null; }
        if (found) {
          var chips = [];
          for (var g = 0; g < found.length; g += 1) {
            chips.push('<span class="group-chip"><span class="group-idx">m[' + g + ']</span>' +
              escapeHtml(found[g] === undefined ? '(vide)' : found[g]) + '</span>');
          }
          groups = '<p class="group-row">' + chips.join('') + '</p>';
        }
      }
      return '<div class="demo">' +
        '<div class="demo-head">' +
          (block.label ? '<span class="demo-label">' + escapeHtml(block.label) + '</span>' : '') +
          '<code class="demo-pattern">/' + escapeHtml(block.pattern) + '/g</code>' +
        '</div>' +
        '<p class="demo-sample">' + highlight(block.sample, block.pattern, 'g') + '</p>' +
        groups +
        '</div>';
    }

    return '';
  }

  function checkHtml(check) {
    if (!check) return '';
    var cases = (check.tests || []).map(function (test) {
      return '<li class="case" data-input="' + escapeHtml(test.input) + '">' +
        (test.input === '' ? '(chaîne vide)' : escapeHtml(test.input)) + '</li>';
    }).join('');

    return '<div class="check" id="lesson-check">' +
      '<p class="check-title">À toi de jouer</p>' +
      '<p class="check-prompt">' + fmt(check.prompt) + '</p>' +
      '<p class="check-hint">Indice : ' + fmt(check.hint) + '</p>' +
      '<label class="sr-only" for="canswer">Ta regex pour ce contrôle</label>' +
      '<div class="field cfield" id="cfield">' +
        '<span class="delim" aria-hidden="true">/</span>' +
        '<input id="canswer" class="canswer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ta regex ici">' +
        '<span class="delim" aria-hidden="true">/g</span>' +
      '</div>' +
      (cases ? '<ul class="cases ccases" id="ccases">' + cases + '</ul>' : '') +
      (check.extract ? '<p class="extract-expected" id="cextract">Attendu : ' +
        check.extract.expected.map(function (value) { return '<span class="case">' + escapeHtml(value) + '</span>'; }).join(' ') +
        '</p>' : '') +
      '<p class="feedback" id="cfeedback" role="status" aria-live="polite"></p>' +
      '<div class="actions">' +
        '<button class="btn btn-primary" type="button" id="ccheck">Vérifier <kbd>⏎</kbd></button>' +
        '<button class="btn btn-ghost" type="button" id="creveal">Voir la solution</button>' +
      '</div>' +
      '</div>';
  }

  function evaluateCheck(check, source) {
    var result = { error: '', cases: [], extract: null, valid: false };
    var regex;
    try {
      regex = build(source, '');
    } catch (err) {
      result.error = err.message;
      return result;
    }

    var ok = true;

    (check.tests || []).forEach(function (test) {
      var got = regex.test(test.input);
      var pass = got === test.ok;
      if (!pass) ok = false;
      result.cases.push({ input: test.input, expected: test.ok, pass: pass });
    });

    if (check.extract) {
      var list = [];
      var scanError = '';
      try {
        var global = build(source, 'g');
        var groupIndex = check.extract.group || 0;
        var match;
        var guard = 0;
        while ((match = global.exec(check.extract.input)) !== null) {
          if (guard++ > 5000) break;
          var value = match[groupIndex];
          list.push(value === undefined ? '' : value);
          if (match[0] === '') global.lastIndex += 1;
        }
      } catch (err) {
        scanError = err.message;
      }
      var expected = check.extract.expected;
      var same = list.length === expected.length && list.every(function (value, i) {
        return value === expected[i];
      });
      if (!same) ok = false;
      result.extract = { expected: expected, matches: list, pass: same, error: scanError };
    }

    result.valid = ok;
    return result;
  }

  function renderLesson() {
    var lesson = LESSONS[state.index];
    var done = Boolean(state.done[lesson.id]);

    dom.lesson.innerHTML =
      '<div class="card-head">' +
        '<div>' +
          '<p class="eyebrow">Leçon ' + (state.index + 1) + ' / ' + LESSONS.length + ' · ' + escapeHtml(lesson.tagline) + '</p>' +
          '<h2 class="ex-title" id="lesson-title">' + escapeHtml(lesson.title) + '</h2>' +
        '</div>' +
        (done ? '<span class="solved-flag">vue</span>' : '') +
      '</div>' +
      '<p class="lesson-goal"><span class="goal-tag">Objectif</span>' + fmt(lesson.goal) + '</p>' +
      lesson.blocks.map(blockHtml).join('') +
      '<div id="check-slot">' + checkHtml(lesson.check) + '</div>' +
      '<div class="pager">' +
        '<button class="btn btn-ghost" type="button" id="lprev"' + (state.index === 0 ? ' disabled' : '') + '>← Leçon précédente</button>' +
        '<button class="btn btn-ghost" type="button" id="lnext"' + (state.index === LESSONS.length - 1 ? ' disabled' : '') + '>Leçon suivante →</button>' +
      '</div>';

    document.getElementById('lprev').addEventListener('click', function () { goLesson(-1); });
    document.getElementById('lnext').addEventListener('click', function () { goLesson(1); });

    if (lesson.check) wireCheck(lesson.check);
    else markRead(lesson.id);

    renderLessonNav();
    renderCourseProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function wireCheck(check) {
    var input = document.getElementById('canswer');
    var field = document.getElementById('cfield');
    var feedback = document.getElementById('cfeedback');
    var cases = document.getElementById('ccases');
    var extractLine = document.getElementById('cextract');

    function paint(result) {
      if (cases) {
        var nodes = cases.querySelectorAll('.case');
        result.cases.forEach(function (item, i) {
          var node = nodes[i];
          if (!node) return;
          node.classList.toggle('is-ok', item.pass);
          node.classList.toggle('is-bad', !item.pass && Boolean(input.value.trim()));
        });
      }
      if (extractLine && result.extract) {
        var got = result.extract.matches.length
          ? result.extract.matches.map(function (value) {
              return '<span class="case' + (result.extract.pass ? ' is-ok' : '') + '">' + escapeHtml(value) + '</span>';
            }).join(' ')
          : '<span class="case">—</span>';
        extractLine.innerHTML = 'Attendu : ' +
          result.extract.expected.map(function (value) { return '<span class="case">' + escapeHtml(value) + '</span>'; }).join(' ') +
          ' · Obtenu : ' + got;
      }
    }

    input.addEventListener('input', function () {
      field.classList.remove('is-ok', 'is-bad');
      var source = input.value.trim();
      if (!source) {
        feedback.textContent = '';
        if (cases) cases.querySelectorAll('.case').forEach(function (node) { node.classList.remove('is-ok', 'is-bad'); });
        return;
      }
      var result = evaluateCheck(check, source);
      if (result.error) return;
      paint(result);
      field.classList.toggle('is-ok', result.valid);
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') { event.preventDefault(); verify(); }
    });

    function verify() {
      var source = input.value.trim();
      if (!source) {
        feedback.textContent = 'Saisis un motif avant de vérifier.';
        feedback.className = 'feedback is-bad';
        input.focus();
        return;
      }
      var result = evaluateCheck(check, source);
      if (result.error) {
        field.classList.add('is-bad');
        field.classList.remove('is-ok');
        feedback.textContent = 'Syntaxe refusée par le moteur : ' + result.error;
        feedback.className = 'feedback is-bad';
        return;
      }
      paint(result);
      if (result.valid) {
        field.classList.add('is-ok');
        field.classList.remove('is-bad');
        feedback.textContent = 'Correct. Tu peux passer à la suite.';
        feedback.className = 'feedback is-ok';
        markRead(LESSONS[state.index].id);
      } else {
        field.classList.add('is-bad');
        field.classList.remove('is-ok');
        feedback.textContent = 'Pas encore. Le cas en rouge casse : corrige un seul symbole à la fois.';
        feedback.className = 'feedback is-bad';
      }
    }

    document.getElementById('ccheck').addEventListener('click', verify);
    document.getElementById('creveal').addEventListener('click', function () {
      input.value = check.solution;
      input.focus();
      verify();
    });
  }

  function markRead(id) {
    if (state.done[id]) return;
    state.done[id] = true;
    saveCourse();
    renderLessonNav();
    renderCourseProgress();
    var next = document.getElementById('lnext');
    if (next) next.textContent = 'Leçon suivante →';
    var flag = dom.lesson.querySelector('.solved-flag');
    if (!flag) {
      var head = dom.lesson.querySelector('.card-head');
      if (head) {
        var badge = document.createElement('span');
        badge.className = 'solved-flag';
        badge.textContent = 'vue';
        head.appendChild(badge);
      }
    }
  }

  function goLesson(delta) {
    var next = state.index + delta;
    if (next < 0 || next >= LESSONS.length) return;
    state.index = next;
    saveCourse();
    renderLesson();
  }

  function goLessonTo(index) {
    if (index < 0 || index >= LESSONS.length) return;
    state.index = index;
    saveCourse();
    renderLesson();
  }

  /* ------------------------------------------------------------- mode onglets */

  function setMode(mode) {
    var learn = mode === 'learn';
    dom.courseView.hidden = !learn;
    dom.drillView.hidden = learn;
    dom.modeTabs.querySelectorAll('[data-mode]').forEach(function (tab) {
      tab.setAttribute('aria-current', String(tab.dataset.mode === mode));
    });
    document.body.dataset.mode = mode;
    try { localStorage.setItem(MODE_KEY, mode); } catch (err) { /* ignore */ }
    if (learn) {
      renderCourseProgress();
    } else if (window.__drills && window.__drills.refresh) {
      window.__drills.refresh();
    }
  }

  function bootCourse() {
    dom.courseView = document.getElementById('course-view');
    dom.drillView = document.getElementById('drill-view');
    dom.lessons = document.getElementById('lessons');
    dom.lesson = document.getElementById('lesson');
    dom.modeTabs = document.getElementById('mode-tabs');
    dom.progressLabel = document.getElementById('progress-label');
    dom.progressFill = document.getElementById('progress-fill');
    dom.progressTrack = document.querySelector('.progress-track');

    if (!dom.courseView || !LESSONS.length) return;

    loadCourse();

    dom.lessons.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-lesson]');
      if (!chip) return;
      goLessonTo(Number(chip.dataset.lesson));
    });

    dom.modeTabs.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-mode]');
      if (!tab) return;
      setMode(tab.dataset.mode);
    });

    document.addEventListener('keydown', function (event) {
      if (document.body.dataset.mode !== 'learn') return;
      var tag = (event.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (event.key === 'ArrowRight') goLesson(1);
      if (event.key === 'ArrowLeft') goLesson(-1);
    });

    renderLessonNav();
    renderLesson();

    var saved = null;
    try { saved = localStorage.getItem(MODE_KEY); } catch (err) { saved = null; }
    setMode(saved === 'drill' ? 'drill' : 'learn');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCourse);
  } else {
    bootCourse();
  }
})();
