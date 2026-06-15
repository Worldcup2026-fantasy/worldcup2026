import { Player } from "@/types";

// Full WC2026 fallback — all 48 nations, ~260 players
// IDs 1-299. Used when Supabase is unreachable; DB is source of truth at runtime.
export const PLAYERS: Player[] = [
  // ── France 🇫🇷 ──────────────────────────────────────────────────
  { id:101, name:"M. Maignan",        team:"France",       pos:"GK",  price:8.5,  flag:"🇫🇷", totalPoints:0 },
  { id:102, name:"T. Hernandez",      team:"France",       pos:"DEF", price:7.5,  flag:"🇫🇷", totalPoints:0 },
  { id:103, name:"W. Saliba",         team:"France",       pos:"DEF", price:7.0,  flag:"🇫🇷", totalPoints:0 },
  { id:104, name:"J. Konaté",         team:"France",       pos:"DEF", price:6.5,  flag:"🇫🇷", totalPoints:0 },
  { id:105, name:"Mbappé",            team:"France",       pos:"FWD", price:14.0, flag:"🇫🇷", totalPoints:0 },
  { id:106, name:"O. Dembélé",        team:"France",       pos:"MID", price:9.5,  flag:"🇫🇷", totalPoints:0 },
  { id:107, name:"A. Tchouaméni",     team:"France",       pos:"MID", price:7.5,  flag:"🇫🇷", totalPoints:0 },
  { id:108, name:"M. Thuram",         team:"France",       pos:"FWD", price:9.0,  flag:"🇫🇷", totalPoints:0 },
  // ── Spain 🇪🇸 ────────────────────────────────────────────────────
  { id:111, name:"U. Simón",          team:"Spain",        pos:"GK",  price:7.5,  flag:"🇪🇸", totalPoints:0 },
  { id:112, name:"D. Carvajal",       team:"Spain",        pos:"DEF", price:6.5,  flag:"🇪🇸", totalPoints:0 },
  { id:113, name:"Pau Cubarsí",       team:"Spain",        pos:"DEF", price:7.0,  flag:"🇪🇸", totalPoints:0 },
  { id:114, name:"Pedri",             team:"Spain",        pos:"MID", price:9.5,  flag:"🇪🇸", totalPoints:0 },
  { id:115, name:"Rodri",             team:"Spain",        pos:"MID", price:9.5,  flag:"🇪🇸", totalPoints:0 },
  { id:116, name:"Yamal",             team:"Spain",        pos:"MID", price:12.5, flag:"🇪🇸", totalPoints:0 },
  { id:117, name:"F. Torres",         team:"Spain",        pos:"FWD", price:8.0,  flag:"🇪🇸", totalPoints:0 },
  { id:118, name:"M. Morata",         team:"Spain",        pos:"FWD", price:7.5,  flag:"🇪🇸", totalPoints:0 },
  // ── England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 ──────────────────────────────────────────────────
  { id:121, name:"J. Pickford",       team:"England",      pos:"GK",  price:6.5,  flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:122, name:"T. Alexander-Arnold",team:"England",     pos:"DEF", price:8.0,  flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:123, name:"M. Guéhi",          team:"England",      pos:"DEF", price:5.5,  flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:124, name:"J. Bellingham",     team:"England",      pos:"MID", price:12.0, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:125, name:"P. Foden",          team:"England",      pos:"MID", price:11.0, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:126, name:"D. Rice",           team:"England",      pos:"MID", price:8.5,  flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:127, name:"B. Saka",           team:"England",      pos:"MID", price:11.5, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:128, name:"H. Kane",           team:"England",      pos:"FWD", price:12.0, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  { id:129, name:"O. Watkins",        team:"England",      pos:"FWD", price:8.0,  flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", totalPoints:0 },
  // ── Germany 🇩🇪 ──────────────────────────────────────────────────
  { id:131, name:"M. ter Stegen",     team:"Germany",      pos:"GK",  price:7.5,  flag:"🇩🇪", totalPoints:0 },
  { id:132, name:"J. Kimmich",        team:"Germany",      pos:"DEF", price:8.0,  flag:"🇩🇪", totalPoints:0 },
  { id:133, name:"A. Rüdiger",        team:"Germany",      pos:"DEF", price:7.0,  flag:"🇩🇪", totalPoints:0 },
  { id:134, name:"J. Musiala",        team:"Germany",      pos:"MID", price:11.5, flag:"🇩🇪", totalPoints:0 },
  { id:135, name:"F. Wirtz",          team:"Germany",      pos:"MID", price:12.0, flag:"🇩🇪", totalPoints:0 },
  { id:136, name:"K. Havertz",        team:"Germany",      pos:"FWD", price:9.5,  flag:"🇩🇪", totalPoints:0 },
  // ── Portugal 🇵🇹 ─────────────────────────────────────────────────
  { id:141, name:"D. Costa",          team:"Portugal",     pos:"GK",  price:7.0,  flag:"🇵🇹", totalPoints:0 },
  { id:142, name:"R. Dias",           team:"Portugal",     pos:"DEF", price:7.0,  flag:"🇵🇹", totalPoints:0 },
  { id:143, name:"C. Ronaldo",        team:"Portugal",     pos:"FWD", price:11.5, flag:"🇵🇹", totalPoints:0 },
  { id:144, name:"B. Fernandes",      team:"Portugal",     pos:"MID", price:10.0, flag:"🇵🇹", totalPoints:0 },
  { id:145, name:"R. Leão",           team:"Portugal",     pos:"FWD", price:9.5,  flag:"🇵🇹", totalPoints:0 },
  { id:146, name:"J. Neves",          team:"Portugal",     pos:"MID", price:8.0,  flag:"🇵🇹", totalPoints:0 },
  { id:147, name:"G. Ramos",          team:"Portugal",     pos:"FWD", price:8.5,  flag:"🇵🇹", totalPoints:0 },
  // ── Netherlands 🇳🇱 ──────────────────────────────────────────────
  { id:151, name:"B. Flekken",        team:"Netherlands",  pos:"GK",  price:6.5,  flag:"🇳🇱", totalPoints:0 },
  { id:152, name:"V. van Dijk",       team:"Netherlands",  pos:"DEF", price:8.0,  flag:"🇳🇱", totalPoints:0 },
  { id:153, name:"J. Timber",         team:"Netherlands",  pos:"DEF", price:7.0,  flag:"🇳🇱", totalPoints:0 },
  { id:154, name:"X. Simons",         team:"Netherlands",  pos:"MID", price:10.5, flag:"🇳🇱", totalPoints:0 },
  { id:155, name:"F. de Jong",        team:"Netherlands",  pos:"MID", price:9.0,  flag:"🇳🇱", totalPoints:0 },
  { id:156, name:"C. Gakpo",          team:"Netherlands",  pos:"FWD", price:10.0, flag:"🇳🇱", totalPoints:0 },
  { id:157, name:"M. Depay",          team:"Netherlands",  pos:"FWD", price:8.0,  flag:"🇳🇱", totalPoints:0 },
  // ── Belgium 🇧🇪 ───────────────────────────────────────────────────
  { id:161, name:"T. Courtois",       team:"Belgium",      pos:"GK",  price:9.0,  flag:"🇧🇪", totalPoints:0 },
  { id:162, name:"K. De Bruyne",      team:"Belgium",      pos:"MID", price:12.5, flag:"🇧🇪", totalPoints:0 },
  { id:163, name:"J. Doku",           team:"Belgium",      pos:"MID", price:9.5,  flag:"🇧🇪", totalPoints:0 },
  { id:164, name:"R. Lukaku",         team:"Belgium",      pos:"FWD", price:9.5,  flag:"🇧🇪", totalPoints:0 },
  { id:165, name:"L. Trossard",       team:"Belgium",      pos:"FWD", price:8.0,  flag:"🇧🇪", totalPoints:0 },
  { id:166, name:"W. Faes",           team:"Belgium",      pos:"DEF", price:5.5,  flag:"🇧🇪", totalPoints:0 },
  // ── Croatia 🇭🇷 ───────────────────────────────────────────────────
  { id:171, name:"D. Livaković",      team:"Croatia",      pos:"GK",  price:7.0,  flag:"🇭🇷", totalPoints:0 },
  { id:172, name:"J. Gvardiol",       team:"Croatia",      pos:"DEF", price:8.5,  flag:"🇭🇷", totalPoints:0 },
  { id:173, name:"L. Modrić",         team:"Croatia",      pos:"MID", price:10.0, flag:"🇭🇷", totalPoints:0 },
  { id:174, name:"M. Kovačić",        team:"Croatia",      pos:"MID", price:8.0,  flag:"🇭🇷", totalPoints:0 },
  { id:175, name:"A. Kramarić",       team:"Croatia",      pos:"FWD", price:8.5,  flag:"🇭🇷", totalPoints:0 },
  // ── Norway 🇳🇴 ────────────────────────────────────────────────────
  { id:181, name:"Ø. Nyland",         team:"Norway",       pos:"GK",  price:5.5,  flag:"🇳🇴", totalPoints:0 },
  { id:182, name:"M. Ødegaard",       team:"Norway",       pos:"MID", price:12.0, flag:"🇳🇴", totalPoints:0 },
  { id:183, name:"E. Haaland",        team:"Norway",       pos:"FWD", price:14.0, flag:"🇳🇴", totalPoints:0 },
  { id:184, name:"A. Sorloth",        team:"Norway",       pos:"FWD", price:8.0,  flag:"🇳🇴", totalPoints:0 },
  { id:185, name:"S. Berge",          team:"Norway",       pos:"MID", price:7.0,  flag:"🇳🇴", totalPoints:0 },
  // ── Switzerland 🇨🇭 ───────────────────────────────────────────────
  { id:191, name:"Y. Sommer",         team:"Switzerland",  pos:"GK",  price:7.5,  flag:"🇨🇭", totalPoints:0 },
  { id:192, name:"M. Akanji",         team:"Switzerland",  pos:"DEF", price:7.5,  flag:"🇨🇭", totalPoints:0 },
  { id:193, name:"G. Xhaka",          team:"Switzerland",  pos:"MID", price:8.0,  flag:"🇨🇭", totalPoints:0 },
  { id:194, name:"B. Embolo",         team:"Switzerland",  pos:"FWD", price:7.5,  flag:"🇨🇭", totalPoints:0 },
  { id:195, name:"N. Okafor",         team:"Switzerland",  pos:"FWD", price:7.0,  flag:"🇨🇭", totalPoints:0 },
  // ── Austria 🇦🇹 ───────────────────────────────────────────────────
  { id:196, name:"P. Pentz",          team:"Austria",      pos:"GK",  price:5.5,  flag:"🇦🇹", totalPoints:0 },
  { id:197, name:"P. Laimer",         team:"Austria",      pos:"MID", price:7.5,  flag:"🇦🇹", totalPoints:0 },
  { id:198, name:"K. Arnautovic",     team:"Austria",      pos:"FWD", price:7.5,  flag:"🇦🇹", totalPoints:0 },
  // ── Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 ──────────────────────────────────────────────
  { id:201, name:"A. Gunn",           team:"Scotland",     pos:"GK",  price:5.0,  flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", totalPoints:0 },
  { id:202, name:"A. Robertson",      team:"Scotland",     pos:"DEF", price:7.5,  flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", totalPoints:0 },
  { id:203, name:"S. McTominay",      team:"Scotland",     pos:"MID", price:8.5,  flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", totalPoints:0 },
  { id:204, name:"L. Ferguson",       team:"Scotland",     pos:"FWD", price:8.0,  flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", totalPoints:0 },
  // ── Türkiye 🇹🇷 ───────────────────────────────────────────────────
  { id:205, name:"A. Günok",          team:"Türkiye",      pos:"GK",  price:5.5,  flag:"🇹🇷", totalPoints:0 },
  { id:206, name:"H. Çalhanoğlu",     team:"Türkiye",      pos:"MID", price:10.0, flag:"🇹🇷", totalPoints:0 },
  { id:207, name:"A. Yıldız",         team:"Türkiye",      pos:"FWD", price:8.5,  flag:"🇹🇷", totalPoints:0 },
  { id:208, name:"M. Demiral",        team:"Türkiye",      pos:"DEF", price:6.5,  flag:"🇹🇷", totalPoints:0 },
  // ── Czechia 🇨🇿 ───────────────────────────────────────────────────
  { id:209, name:"J. Staněk",         team:"Czechia",      pos:"GK",  price:6.0,  flag:"🇨🇿", totalPoints:0 },
  { id:210, name:"T. Souček",         team:"Czechia",      pos:"MID", price:8.0,  flag:"🇨🇿", totalPoints:0 },
  { id:211, name:"P. Schick",         team:"Czechia",      pos:"FWD", price:8.0,  flag:"🇨🇿", totalPoints:0 },
  // ── Bosnia 🇧🇦 ────────────────────────────────────────────────────
  { id:212, name:"E. Džeko",          team:"Bosnia",       pos:"FWD", price:7.5,  flag:"🇧🇦", totalPoints:0 },
  { id:213, name:"S. Kolasinac",      team:"Bosnia",       pos:"DEF", price:6.0,  flag:"🇧🇦", totalPoints:0 },
  { id:214, name:"S. Pjanić",         team:"Bosnia",       pos:"MID", price:6.5,  flag:"🇧🇦", totalPoints:0 },
  // ── Sweden 🇸🇪 ────────────────────────────────────────────────────
  { id:215, name:"R. Olsen",          team:"Sweden",       pos:"GK",  price:5.5,  flag:"🇸🇪", totalPoints:0 },
  { id:216, name:"V. Gyökeres",       team:"Sweden",       pos:"FWD", price:12.5, flag:"🇸🇪", totalPoints:0 },
  { id:217, name:"A. Isak",           team:"Sweden",       pos:"FWD", price:12.0, flag:"🇸🇪", totalPoints:0 },
  { id:218, name:"L. Bergvall",       team:"Sweden",       pos:"MID", price:7.5,  flag:"🇸🇪", totalPoints:0 },
  { id:219, name:"A. Elanga",         team:"Sweden",       pos:"MID", price:7.0,  flag:"🇸🇪", totalPoints:0 },

  // ── Argentina 🇦🇷 ─────────────────────────────────────────────────
  { id:221, name:"E. Martínez",       team:"Argentina",    pos:"GK",  price:9.5,  flag:"🇦🇷", totalPoints:0 },
  { id:222, name:"C. Romero",         team:"Argentina",    pos:"DEF", price:8.0,  flag:"🇦🇷", totalPoints:0 },
  { id:223, name:"N. Molina",         team:"Argentina",    pos:"DEF", price:7.0,  flag:"🇦🇷", totalPoints:0 },
  { id:224, name:"M. Acuña",          team:"Argentina",    pos:"DEF", price:6.0,  flag:"🇦🇷", totalPoints:0 },
  { id:225, name:"L. Messi",          team:"Argentina",    pos:"FWD", price:14.0, flag:"🇦🇷", totalPoints:0 },
  { id:226, name:"J. Álvarez",        team:"Argentina",    pos:"FWD", price:9.5,  flag:"🇦🇷", totalPoints:0 },
  { id:227, name:"E. Mac Allister",   team:"Argentina",    pos:"MID", price:9.0,  flag:"🇦🇷", totalPoints:0 },
  { id:228, name:"R. De Paul",        team:"Argentina",    pos:"MID", price:8.5,  flag:"🇦🇷", totalPoints:0 },
  { id:229, name:"F. Mastantuono",    team:"Argentina",    pos:"MID", price:7.5,  flag:"🇦🇷", totalPoints:0 },
  // ── Brazil 🇧🇷 ────────────────────────────────────────────────────
  { id:231, name:"Alisson",           team:"Brazil",       pos:"GK",  price:9.5,  flag:"🇧🇷", totalPoints:0 },
  { id:232, name:"Ederson",           team:"Brazil",       pos:"GK",  price:8.0,  flag:"🇧🇷", totalPoints:0 },
  { id:233, name:"Marquinhos",        team:"Brazil",       pos:"DEF", price:8.0,  flag:"🇧🇷", totalPoints:0 },
  { id:234, name:"G. Magalhães",      team:"Brazil",       pos:"DEF", price:6.5,  flag:"🇧🇷", totalPoints:0 },
  { id:235, name:"Vinicius Jr",       team:"Brazil",       pos:"FWD", price:13.5, flag:"🇧🇷", totalPoints:0 },
  { id:236, name:"Raphinha",          team:"Brazil",       pos:"FWD", price:11.0, flag:"🇧🇷", totalPoints:0 },
  { id:237, name:"Endrick",           team:"Brazil",       pos:"FWD", price:9.0,  flag:"🇧🇷", totalPoints:0 },
  { id:238, name:"Rodrygo",           team:"Brazil",       pos:"FWD", price:9.5,  flag:"🇧🇷", totalPoints:0 },
  { id:239, name:"Neymar",            team:"Brazil",       pos:"FWD", price:10.5, flag:"🇧🇷", totalPoints:0 },
  { id:240, name:"Lucas Paquetá",     team:"Brazil",       pos:"MID", price:9.0,  flag:"🇧🇷", totalPoints:0 },
  { id:241, name:"B. Guimarães",      team:"Brazil",       pos:"MID", price:8.5,  flag:"🇧🇷", totalPoints:0 },
  // ── Uruguay 🇺🇾 ───────────────────────────────────────────────────
  { id:242, name:"S. Rochet",         team:"Uruguay",      pos:"GK",  price:6.0,  flag:"🇺🇾", totalPoints:0 },
  { id:243, name:"R. Araújo",         team:"Uruguay",      pos:"DEF", price:8.0,  flag:"🇺🇾", totalPoints:0 },
  { id:244, name:"F. Valverde",       team:"Uruguay",      pos:"MID", price:9.5,  flag:"🇺🇾", totalPoints:0 },
  { id:245, name:"D. Núñez",          team:"Uruguay",      pos:"FWD", price:11.5, flag:"🇺🇾", totalPoints:0 },
  { id:246, name:"M. Ugarte",         team:"Uruguay",      pos:"MID", price:7.0,  flag:"🇺🇾", totalPoints:0 },
  // ── Colombia 🇨🇴 ──────────────────────────────────────────────────
  { id:247, name:"C. Vargas",         team:"Colombia",     pos:"GK",  price:6.5,  flag:"🇨🇴", totalPoints:0 },
  { id:248, name:"L. Díaz",           team:"Colombia",     pos:"FWD", price:11.5, flag:"🇨🇴", totalPoints:0 },
  { id:249, name:"J. Durán",          team:"Colombia",     pos:"FWD", price:9.0,  flag:"🇨🇴", totalPoints:0 },
  { id:250, name:"D. Muñoz",          team:"Colombia",     pos:"DEF", price:7.0,  flag:"🇨🇴", totalPoints:0 },
  { id:251, name:"M. Caicedo",        team:"Ecuador",      pos:"MID", price:9.5,  flag:"🇪🇨", totalPoints:0 },
  { id:252, name:"P. Hincapié",       team:"Ecuador",      pos:"DEF", price:7.0,  flag:"🇪🇨", totalPoints:0 },
  { id:253, name:"E. Valencia",       team:"Ecuador",      pos:"FWD", price:7.0,  flag:"🇪🇨", totalPoints:0 },
  { id:254, name:"M. Almirón",        team:"Paraguay",     pos:"MID", price:8.5,  flag:"🇵🇾", totalPoints:0 },
  { id:255, name:"A. Sanabria",       team:"Paraguay",     pos:"FWD", price:7.0,  flag:"🇵🇾", totalPoints:0 },

  // ── USA 🇺🇸 ───────────────────────────────────────────────────────
  { id:261, name:"M. Turner",         team:"USA",          pos:"GK",  price:6.5,  flag:"🇺🇸", totalPoints:0 },
  { id:262, name:"C. Pulisic",        team:"USA",          pos:"MID", price:9.5,  flag:"🇺🇸", totalPoints:0 },
  { id:263, name:"T. Adams",          team:"USA",          pos:"MID", price:7.5,  flag:"🇺🇸", totalPoints:0 },
  { id:264, name:"Y. Musah",          team:"USA",          pos:"MID", price:7.5,  flag:"🇺🇸", totalPoints:0 },
  { id:265, name:"F. Balogun",        team:"USA",          pos:"FWD", price:8.0,  flag:"🇺🇸", totalPoints:0 },
  { id:266, name:"S. Dest",           team:"USA",          pos:"DEF", price:6.5,  flag:"🇺🇸", totalPoints:0 },
  // ── Mexico 🇲🇽 ────────────────────────────────────────────────────
  { id:267, name:"G. Ochoa",          team:"Mexico",       pos:"GK",  price:6.0,  flag:"🇲🇽", totalPoints:0 },
  { id:268, name:"S. Giménez",        team:"Mexico",       pos:"FWD", price:10.5, flag:"🇲🇽", totalPoints:0 },
  { id:269, name:"H. Lozano",         team:"Mexico",       pos:"FWD", price:8.5,  flag:"🇲🇽", totalPoints:0 },
  { id:270, name:"E. Álvarez",        team:"Mexico",       pos:"DEF", price:7.0,  flag:"🇲🇽", totalPoints:0 },
  // ── Canada 🇨🇦 ────────────────────────────────────────────────────
  { id:271, name:"M. Crepeau",        team:"Canada",       pos:"GK",  price:6.0,  flag:"🇨🇦", totalPoints:0 },
  { id:272, name:"A. Davies",         team:"Canada",       pos:"DEF", price:9.0,  flag:"🇨🇦", totalPoints:0 },
  { id:273, name:"J. David",          team:"Canada",       pos:"FWD", price:11.0, flag:"🇨🇦", totalPoints:0 },
  { id:274, name:"T. Buchanan",       team:"Canada",       pos:"FWD", price:8.0,  flag:"🇨🇦", totalPoints:0 },
  // ── Panama 🇵🇦 ────────────────────────────────────────────────────
  { id:275, name:"L. Mejía",          team:"Panama",       pos:"GK",  price:5.0,  flag:"🇵🇦", totalPoints:0 },
  { id:276, name:"A. Murillo",        team:"Panama",       pos:"DEF", price:6.5,  flag:"🇵🇦", totalPoints:0 },
  { id:277, name:"C. Córdoba",        team:"Panama",       pos:"FWD", price:6.0,  flag:"🇵🇦", totalPoints:0 },
  // ── Haiti 🇭🇹 / Curaçao 🇨🇼 ─────────────────────────────────────
  { id:278, name:"G. Nazon",          team:"Haiti",        pos:"FWD", price:5.5,  flag:"🇭🇹", totalPoints:0 },
  { id:279, name:"Q. Promes",         team:"Curaçao",      pos:"FWD", price:6.5,  flag:"🇨🇼", totalPoints:0 },

  // ── Morocco 🇲🇦 ───────────────────────────────────────────────────
  { id:281, name:"Y. Bounou",         team:"Morocco",      pos:"GK",  price:8.0,  flag:"🇲🇦", totalPoints:0 },
  { id:282, name:"A. Hakimi",         team:"Morocco",      pos:"DEF", price:9.0,  flag:"🇲🇦", totalPoints:0 },
  { id:283, name:"H. Ziyech",         team:"Morocco",      pos:"MID", price:8.0,  flag:"🇲🇦", totalPoints:0 },
  { id:284, name:"Y. En-Nesyri",      team:"Morocco",      pos:"FWD", price:9.0,  flag:"🇲🇦", totalPoints:0 },
  { id:285, name:"S. Amrabat",        team:"Morocco",      pos:"MID", price:7.5,  flag:"🇲🇦", totalPoints:0 },
  // ── Senegal 🇸🇳 ───────────────────────────────────────────────────
  { id:286, name:"E. Mendy",          team:"Senegal",      pos:"GK",  price:7.5,  flag:"🇸🇳", totalPoints:0 },
  { id:287, name:"K. Koulibaly",      team:"Senegal",      pos:"DEF", price:7.5,  flag:"🇸🇳", totalPoints:0 },
  { id:288, name:"S. Mané",           team:"Senegal",      pos:"FWD", price:10.0, flag:"🇸🇳", totalPoints:0 },
  { id:289, name:"I. Sarr",           team:"Senegal",      pos:"FWD", price:8.5,  flag:"🇸🇳", totalPoints:0 },
  // ── Ivory Coast 🇨🇮 ───────────────────────────────────────────────
  { id:290, name:"F. Kessié",         team:"Ivory Coast",  pos:"MID", price:8.5,  flag:"🇨🇮", totalPoints:0 },
  { id:291, name:"S. Haller",         team:"Ivory Coast",  pos:"FWD", price:8.0,  flag:"🇨🇮", totalPoints:0 },
  { id:292, name:"W. Zaha",           team:"Ivory Coast",  pos:"FWD", price:8.0,  flag:"🇨🇮", totalPoints:0 },
  // ── Egypt 🇪🇬 ─────────────────────────────────────────────────────
  { id:293, name:"M. Salah",          team:"Egypt",        pos:"FWD", price:14.0, flag:"🇪🇬", totalPoints:0 },
  { id:294, name:"O. Marmoush",       team:"Egypt",        pos:"FWD", price:10.0, flag:"🇪🇬", totalPoints:0 },
  { id:295, name:"M. El-Shenawy",     team:"Egypt",        pos:"GK",  price:6.0,  flag:"🇪🇬", totalPoints:0 },
  // ── Ghana 🇬🇭 ─────────────────────────────────────────────────────
  { id:296, name:"T. Partey",         team:"Ghana",        pos:"MID", price:9.0,  flag:"🇬🇭", totalPoints:0 },
  { id:297, name:"M. Kudus",          team:"Ghana",        pos:"MID", price:9.5,  flag:"🇬🇭", totalPoints:0 },
  { id:298, name:"J. Ayew",           team:"Ghana",        pos:"FWD", price:7.5,  flag:"🇬🇭", totalPoints:0 },
  // ── Algeria 🇩🇿 ───────────────────────────────────────────────────
  { id:299, name:"R. Mahrez",         team:"Algeria",      pos:"MID", price:9.5,  flag:"🇩🇿", totalPoints:0 },
  { id:300, name:"I. Bennacer",       team:"Algeria",      pos:"MID", price:8.0,  flag:"🇩🇿", totalPoints:0 },
  // ── Tunisia 🇹🇳 ───────────────────────────────────────────────────
  { id:301, name:"Hannibal",          team:"Tunisia",      pos:"MID", price:7.5,  flag:"🇹🇳", totalPoints:0 },
  { id:302, name:"W. Khazri",         team:"Tunisia",      pos:"FWD", price:7.0,  flag:"🇹🇳", totalPoints:0 },
  // ── South Africa 🇿🇦 ──────────────────────────────────────────────
  { id:303, name:"S. Tau",            team:"South Africa", pos:"FWD", price:7.0,  flag:"🇿🇦", totalPoints:0 },
  { id:304, name:"T. Zwane",          team:"South Africa", pos:"MID", price:6.0,  flag:"🇿🇦", totalPoints:0 },
  // ── Cape Verde 🇨🇻 / DR Congo 🇨🇩 ─────────────────────────────────
  { id:305, name:"R. Borges",         team:"Cape Verde",   pos:"MID", price:6.5,  flag:"🇨🇻", totalPoints:0 },
  { id:306, name:"C. Banza",          team:"DR Congo",     pos:"FWD", price:7.5,  flag:"🇨🇩", totalPoints:0 },

  // ── Japan 🇯🇵 ─────────────────────────────────────────────────────
  { id:311, name:"S. Gonda",          team:"Japan",        pos:"GK",  price:6.5,  flag:"🇯🇵", totalPoints:0 },
  { id:312, name:"K. Mitoma",         team:"Japan",        pos:"MID", price:9.5,  flag:"🇯🇵", totalPoints:0 },
  { id:313, name:"J. Endo",           team:"Japan",        pos:"MID", price:8.0,  flag:"🇯🇵", totalPoints:0 },
  { id:314, name:"A. Ueda",           team:"Japan",        pos:"FWD", price:8.5,  flag:"🇯🇵", totalPoints:0 },
  { id:315, name:"T. Minamino",       team:"Japan",        pos:"MID", price:8.0,  flag:"🇯🇵", totalPoints:0 },
  // ── South Korea 🇰🇷 ───────────────────────────────────────────────
  { id:316, name:"Son Heung-min",     team:"South Korea",  pos:"FWD", price:12.0, flag:"🇰🇷", totalPoints:0 },
  { id:317, name:"Lee Kang-in",       team:"South Korea",  pos:"MID", price:9.0,  flag:"🇰🇷", totalPoints:0 },
  { id:318, name:"Kim Min-jae",       team:"South Korea",  pos:"DEF", price:8.0,  flag:"🇰🇷", totalPoints:0 },
  // ── Australia 🇦🇺 ─────────────────────────────────────────────────
  { id:319, name:"M. Ryan",           team:"Australia",    pos:"GK",  price:6.5,  flag:"🇦🇺", totalPoints:0 },
  { id:320, name:"M. Leckie",         team:"Australia",    pos:"MID", price:7.0,  flag:"🇦🇺", totalPoints:0 },
  { id:321, name:"M. Goodwin",        team:"Australia",    pos:"FWD", price:6.5,  flag:"🇦🇺", totalPoints:0 },
  // ── Iran 🇮🇷 ──────────────────────────────────────────────────────
  { id:322, name:"M. Taremi",         team:"Iran",         pos:"FWD", price:9.5,  flag:"🇮🇷", totalPoints:0 },
  { id:323, name:"S. Jahanbakhsh",    team:"Iran",         pos:"MID", price:7.0,  flag:"🇮🇷", totalPoints:0 },
  // ── Saudi Arabia 🇸🇦 ──────────────────────────────────────────────
  { id:324, name:"S. Al-Dawsari",     team:"Saudi Arabia", pos:"MID", price:8.0,  flag:"🇸🇦", totalPoints:0 },
  { id:325, name:"F. Al-Buraikan",    team:"Saudi Arabia", pos:"FWD", price:7.0,  flag:"🇸🇦", totalPoints:0 },
  // ── Qatar 🇶🇦 ─────────────────────────────────────────────────────
  { id:326, name:"A. Afif",           team:"Qatar",        pos:"MID", price:8.0,  flag:"🇶🇦", totalPoints:0 },
  { id:327, name:"A. Almoez",         team:"Qatar",        pos:"FWD", price:7.5,  flag:"🇶🇦", totalPoints:0 },
  // ── Jordan 🇯🇴 / Uzbekistan 🇺🇿 / Iraq 🇮🇶 ──────────────────────
  { id:328, name:"M. Al-Tamari",      team:"Jordan",       pos:"MID", price:7.0,  flag:"🇯🇴", totalPoints:0 },
  { id:329, name:"E. Shomurodov",     team:"Uzbekistan",   pos:"FWD", price:7.5,  flag:"🇺🇿", totalPoints:0 },
  { id:330, name:"A. Allawi",         team:"Iraq",         pos:"FWD", price:6.0,  flag:"🇮🇶", totalPoints:0 },

  // ── New Zealand 🇳🇿 ───────────────────────────────────────────────
  { id:331, name:"C. Wood",           team:"New Zealand",  pos:"FWD", price:7.5,  flag:"🇳🇿", totalPoints:0 },
  { id:332, name:"O. Sail",           team:"New Zealand",  pos:"GK",  price:5.0,  flag:"🇳🇿", totalPoints:0 },
];
