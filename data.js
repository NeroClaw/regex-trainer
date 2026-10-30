/* Banc d'exercices — Regex Drills
   Chaque exercice est vérifié par exécution réelle de la regex, pas par comparaison de texte.
   tests: [{ input, ok }]  -> la regex doit matcher (ok:true) ou ne pas matcher (ok:false)
   extract: { input, expected: [], group? } -> tous les matches (ou le groupe N) doivent égaler expected */

window.CHAPTERS = [
  {
    id: 'classes',
    title: 'Classes de caractères',
    tagline: 'Choisir quels caractères passent le filtre.',
    exercises: [
      {
        id: 'c1',
        title: 'Un seul chiffre',
        prompt: 'Écris une regex qui matche une chaîne composée d\u2019un unique chiffre.',
        hint: 'Il existe une classe raccourcie pour les chiffres : \\d.',
        solution: '^\\d$',
        tests: [
          { input: '7', ok: true },
          { input: '42', ok: false },
          { input: 'a', ok: false }
        ]
      },
      {
        id: 'c2',
        title: 'Que des chiffres',
        prompt: 'Matche une chaîne qui ne contient que des chiffres, sans minimum imposé par toi (au moins un).',
        hint: 'Ancre le début et la fin, puis quantifie la classe.',
        solution: '^\\d+$',
        tests: [
          { input: '4821', ok: true },
          { input: '0', ok: true },
          { input: '48a1', ok: false }
        ]
      },
      {
        id: 'c3',
        title: 'Identifiant technique',
        prompt: 'Matche un identifiant fait uniquement de lettres, de chiffres ou d\u2019underscores.',
        hint: '\\w couvre lettres, chiffres et underscore.',
        solution: '^\\w+$',
        tests: [
          { input: 'total_2', ok: true },
          { input: 'total-2', ok: false },
          { input: 'Été', ok: false }
        ]
      },
      {
        id: 'c4',
        title: 'Classe négative',
        prompt: 'Matche une chaîne d\u2019un seul caractère qui n\u2019est ni une voyelle minuscule ni un espace.',
        hint: 'Un ^ en tête de crochets inverse la classe.',
        solution: '^[^aeiou ]$',
        tests: [
          { input: 'z', ok: true },
          { input: 'e', ok: false },
          { input: ' ', ok: false }
        ]
      },
      {
        id: 'c5',
        title: 'Plage personnalisée',
        prompt: 'Matche une chaîne d\u2019un seul caractère : une minuscule allant de a à f (utile pour les codes hex).',
        hint: 'Une plage s\u2019écrit a-z à l\u2019intérieur des crochets.',
        solution: '^[a-f]$',
        tests: [
          { input: 'c', ok: true },
          { input: 'g', ok: false },
          { input: 'A', ok: false }
        ]
      }
    ]
  },
  {
    id: 'quant',
    title: 'Quantificateurs',
    tagline: 'Combien de fois, exactement.',
    exercises: [
      {
        id: 'q1',
        title: 'Un ou plusieurs',
        prompt: 'Matche une chaîne d\u2019au moins un "a" minuscule, et rien d\u2019autre.',
        hint: 'Le + veut dire "une fois ou plus".',
        solution: '^a+$',
        tests: [
          { input: 'a', ok: true },
          { input: 'aaaa', ok: true },
          { input: '', ok: false },
          { input: 'b', ok: false }
        ]
      },
      {
        id: 'q2',
        title: 'Exactement quatre',
        prompt: 'Matche un code PIN : exactement quatre chiffres.',
        hint: 'Les accolades permettent une quantité fixe : {n}.',
        solution: '^\\d{4}$',
        tests: [
          { input: '4821', ok: true },
          { input: '482', ok: false },
          { input: '48211', ok: false }
        ]
      },
      {
        id: 'q3',
        title: 'Optionnel',
        prompt: 'Matche la chaîne "u" ou la chaîne "us". Rien d\u2019autre.',
        hint: 'Le ? rend le caractère précédent optionnel.',
        solution: '^us?$',
        tests: [
          { input: 'u', ok: true },
          { input: 'us', ok: true },
          { input: 'uss', ok: false }
        ]
      },
      {
        id: 'q4',
        title: 'Entre deux et quatre',
        prompt: 'Matche une chaîne de 2 à 4 "a", pas moins, pas plus.',
        hint: 'Intervalle : {min,max}.',
        solution: '^a{2,4}$',
        tests: [
          { input: 'aa', ok: true },
          { input: 'aaaa', ok: true },
          { input: 'a', ok: false },
          { input: 'aaaaa', ok: false }
        ]
      },
      {
        id: 'q5',
        title: 'Zéro ou plusieurs',
        prompt: 'Matche un "k" précédé de zéro ou plusieurs "o".',
        hint: 'Le * autorise zéro occurrence.',
        solution: '^o*k$',
        tests: [
          { input: 'k', ok: true },
          { input: 'ooook', ok: true },
          { input: 'okay', ok: false }
        ]
      }
    ]
  },
  {
    id: 'anchors',
    title: 'Ancres et frontières',
    tagline: 'Définir où le motif a le droit de se poser.',
    exercises: [
      {
        id: 'a1',
        title: 'Début de chaîne',
        prompt: 'Matche les chaînes qui commencent par "Note".',
        hint: 'L\u2019ancre de début, c\u2019est ^.',
        solution: '^Note',
        tests: [
          { input: 'Note : serveur en maintenance', ok: true },
          { input: 'Une Note importante', ok: false }
        ]
      },
      {
        id: 'a2',
        title: 'Fin de chaîne',
        prompt: 'Matche les chaînes qui se terminent par un point.',
        hint: 'Le point est un métacaractère : il faut l\u2019échapper.',
        solution: '\\.$',
        tests: [
          { input: 'Fini.', ok: true },
          { input: 'Fini', ok: false }
        ]
      },
      {
        id: 'a3',
        title: 'Frontière de mot',
        prompt: 'Matche le mot "chat" seulement quand il est un mot complet.',
        hint: 'Il existe une ancre de frontière de mot : \\b.',
        solution: '\\bchat\\b',
        tests: [
          { input: 'le chat dort', ok: true },
          { input: 'le château dort', ok: false },
          { input: 'des chats', ok: false }
        ]
      },
      {
        id: 'a4',
        title: 'Chaîne vide',
        prompt: 'Matche uniquement une chaîne vide. Un seul espace doit échouer.',
        hint: 'Deux ancres collées.',
        solution: '^$',
        tests: [
          { input: '', ok: true },
          { input: ' ', ok: false }
        ]
      },
      {
        id: 'a5',
        title: 'Pas de lettre en fin',
        prompt: 'Matche une chaîne qui ne se termine pas par une lettre ASCII.',
        hint: 'Pense classe négative combinée à l\u2019ancre de fin.',
        solution: '[^a-zA-Z]$',
        tests: [
          { input: 'abc1', ok: true },
          { input: 'abc', ok: false }
        ]
      }
    ]
  },
  {
    id: 'groups',
    title: 'Groupes et alternance',
    tagline: 'Regrouper, choisir, répéter en bloc.',
    exercises: [
      {
        id: 'g1',
        title: 'Alternance',
        prompt: 'Matche exactement "oui" ou exactement "non".',
        hint: 'La barre verticale sépare les branches.',
        solution: '^(oui|non)$',
        tests: [
          { input: 'oui', ok: true },
          { input: 'non', ok: true },
          { input: 'ouinon', ok: false }
        ]
      },
      {
        id: 'g2',
        title: 'Groupe avec échappement',
        prompt: 'Matche "M." ou "Mme" (les deux civilités), rien d\u2019autre.',
        hint: 'Le point dans "M." doit être échappé dans le groupe.',
        solution: '^M(\\.|me)$',
        tests: [
          { input: 'M.', ok: true },
          { input: 'Mme', ok: true },
          { input: 'Mlle', ok: false }
        ]
      },
      {
        id: 'g3',
        title: 'Répéter un bloc',
        prompt: 'Matche "ab" répété 2 ou 3 fois.',
        hint: 'On quantifie le groupe, pas le caractère.',
        solution: '^(ab){2,3}$',
        tests: [
          { input: 'abab', ok: true },
          { input: 'ababab', ok: true },
          { input: 'ab', ok: false }
        ]
      },
      {
        id: 'g4',
        title: 'Protocole optionnel',
        prompt: 'Matche un début d\u2019URL en http:// ou https://.',
        hint: 'Un seul s optionnel suffit.',
        solution: '^https?://',
        tests: [
          { input: 'http://neroclaw.github.io', ok: true },
          { input: 'https://neroclaw.github.io', ok: true },
          { input: 'ftp://neroclaw.github.io', ok: false }
        ]
      },
      {
        id: 'g5',
        title: 'Groupe non capturant',
        prompt: 'Matche "ab" répété au moins 2 fois, sans créer de groupe de capture.',
        hint: 'Un groupe qui commence par ?: ne capture rien.',
        solution: '^(?:ab)+$',
        tests: [
          { input: 'abab', ok: true },
          { input: 'ababab', ok: true },
          { input: 'a', ok: false }
        ],
        probe: { input: 'abab', maxGroups: 0 }
      }
    ]
  },
  {
    id: 'extract',
    title: 'Capture et extraction',
    tagline: 'Sortir la donnée du texte, pas juste dire oui.',
    exercises: [
      {
        id: 'e1',
        title: 'Tous les nombres',
        prompt: 'Extrais tous les nombres de la phrase.',
        hint: 'Une classe de chiffres plus un quantificateur.',
        solution: '\\d+',
        extract: {
          input: '12 pommes, 4 poires et 130 fraises',
          expected: ['12', '4', '130']
        }
      },
      {
        id: 'e2',
        title: 'Adresses email',
        prompt: 'Extrais les adresses email présentes dans le texte.',
        hint: 'Local-part, @, domaine, point, extension.',
        solution: '[\\w.+-]+@[\\w-]+\\.[\\w.]+',
        extract: {
          input: 'contact@site.fr et support@exemple.fr',
          expected: ['contact@site.fr', 'support@exemple.fr']
        }
      },
      {
        id: 'e3',
        title: 'Sigles en majuscules',
        prompt: 'Extrais les mots entièrement en majuscules, 2 lettres minimum.',
        hint: 'Frontière de mot, plage de majuscules, minimum 2.',
        solution: '\\b[A-Z]{2,}\\b',
        extract: {
          input: 'Le BTS SIO forme des futurs DEV à Amiens',
          expected: ['BTS', 'SIO', 'DEV']
        }
      },
      {
        id: 'e4',
        title: 'Domaine des URL',
        prompt: 'Extrais seulement le nom de domaine de chaque URL, en utilisant un groupe de capture.',
        hint: 'Le vérificateur lit le groupe 1 : place le domaine dans des parenthèses.',
        solution: 'https?://([^/\\s]+)',
        extract: {
          input: 'https://neroclaw.github.io/drills et http://192.168.1.20/admin',
          expected: ['neroclaw.github.io', '192.168.1.20'],
          group: 1
        }
      },
      {
        id: 'e5',
        title: 'Hashtags',
        prompt: 'Extrais tous les hashtags du texte.',
        hint: 'Le dièse n\u2019est pas un métacaractère.',
        solution: '#\\w+',
        extract: {
          input: 'Apprendre les #regex avec du #JavaScript',
          expected: ['#regex', '#JavaScript']
        }
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Gourmandise et lookarounds',
    tagline: 'Contrôler ce qui est consommé, et ce qui est seulement vérifié.',
    exercises: [
      {
        id: 'l1',
        title: 'Arrêter d\u2019être gourmand',
        prompt: 'Extrais chaque citation entre guillemets, une par élément.',
        hint: 'Par défaut .* avale tout jusqu\u2019au dernier guillemet.',
        solution: '".*?"',
        extract: {
          input: 'Il dit "bonjour" et "salut"',
          expected: ['"bonjour"', '"salut"']
        }
      },
      {
        id: 'l2',
        title: 'Lookahead positif',
        prompt: 'Extrais les nombres suivis du symbole €, sans inclure le €.',
        hint: 'Un lookahead vérifie sans consommer.',
        solution: '\\d+(?=\\s?€)',
        extract: {
          input: '12 € et 30 dollars',
          expected: ['12']
        }
      },
      {
        id: 'l3',
        title: 'Lookbehind',
        prompt: 'Extrais les pseudonymes qui suivent un arobase, sans l\u2019arobase.',
        hint: 'Le lookbehind regarde en arrière avec ?<=.',
        solution: '(?<=@)\\w+',
        extract: {
          input: '@neroclaw et @jdupont',
          expected: ['neroclaw', 'jdupont']
        }
      },
      {
        id: 'l4',
        title: 'Lookahead négatif',
        prompt: 'Extrais "foo" uniquement quand il n\u2019est pas suivi de "bar".',
        hint: 'Un point d\u2019exclamation après le ?.',
        solution: 'foo(?!bar)',
        extract: {
          input: 'foobar et foo seul',
          expected: ['foo']
        }
      },
      {
        id: 'l5',
        title: 'Nom de fichier nu',
        prompt: 'Extrais les noms de fichiers sans leur extension.',
        hint: 'Regarde vers l\u2019avant: il doit y avoir un point.',
        solution: '\\w+(?=\\.)',
        extract: {
          input: 'app.js styles.css data.js',
          expected: ['app', 'styles', 'data']
        }
      }
    ]
  }
];
