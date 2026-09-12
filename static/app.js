/**
 * Phoenix AI - Agentic Academic Intelligence Platform
 * Frontend Interactive Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // Application State
  // ==========================================
  const state = {
    activeMode: "tutor", // 'tutor' | 'recommendation' | 'progress' | 'learn' | 'profile' | 'setting'
    history: [],
    currentRecord: null,
    activeDomainFilter: "all",
    attachedFile: null,
    isRecording: false,
    recognition: null,
    modelPreference: "default",
    bwMode: localStorage.getItem("phoenix_bw_mode") === "true",
    language: localStorage.getItem("phoenix_lang") || "en",
    userProfile: {
      user_name: "Academic Scholar",
      knowledge_level: "Advanced",
      streak_days: 5,
      focus_score: 96,
      domain_mastery: { math: 82, programming: 88, physics: 76, chemistry: 70, biology: 74 }
    },
    flashcards: [
      {
        domain: "Quantum Physics",
        q: "What is the Time-Independent Schrödinger Equation in 1D?",
        a: "$$-\\frac{\\hbar^2}{2m} \\frac{d^2\\psi}{dx^2} + V(x)\\psi(x) = E\\psi(x)$$"
      },
      {
        domain: "Algorithms & DP",
        q: "State the space-optimized Fibonacci Recurrence relation.",
        a: "$$F_n = F_{n-1} + F_{n-2}, \\quad \\text{with } F_0 = 0, F_1 = 1 \\quad [O(1) \\text{ auxiliary space}]$$"
      },
      {
        domain: "Cellular Biology",
        q: "What is the net ATP yield per glucose molecule in aerobic cellular respiration?",
        a: "$$\\text{Net Yield: } \\approx 30 - 32 \\text{ ATP} \\quad (\\text{Glycolysis: } 2, \\text{ Krebs: } 2, \\text{ OxPhos: } 26-28)$$"
      },
      {
        domain: "Chemical Thermodynamics",
        q: "What is the Gibbs Free Energy equation relating enthalpy, entropy and temperature?",
        a: "$$\\Delta G = \\Delta H - T\\Delta S \\quad (\\Delta G < 0 \\implies \\text{Spontaneous})$$"
      }
    ],
    currentFlashcardIndex: 0
  };

  // ==========================================
  // DOM Elements
  // ==========================================
  const els = {
    // Navigation Modes
    navButtons: document.querySelectorAll(".nav-sidebar-btn"),
    viewTutor: document.getElementById("viewTutor"),
    viewRecommendation: document.getElementById("viewRecommendation"),
    viewProgress: document.getElementById("viewProgress"),
    viewLearn: document.getElementById("viewLearn"),
    viewProfile: document.getElementById("viewProfile"),
    viewSetting: document.getElementById("viewSetting"),

    // Controls: Language & B&W Mode
    langSelect: document.getElementById("langSelect"),
    settingLangSelect: document.getElementById("settingLangSelect"),
    bwToggleBtn: document.getElementById("bwToggleBtn"),
    settingBwToggleBtn: document.getElementById("settingBwToggleBtn"),
    bwToggleText: document.getElementById("bwToggleText"),
    settingBwText: document.getElementById("settingBwText"),

    // Chat Stream & Input
    chatMessages: document.getElementById("chatMessages"),
    welcomeCard: document.getElementById("welcomeCard"),
    questionInput: document.getElementById("questionInput"),
    sendBtn: document.getElementById("sendBtn"),
    micBtn: document.getElementById("micBtn"),
    newChatBtn: document.getElementById("newChatBtn"),
    historyListContainer: document.getElementById("historyListContainer"),
    historyCountBadge: document.getElementById("historyCountBadge"),
    chatSearchInput: document.getElementById("chatSearchInput"),
    clearAllBtn: document.getElementById("clearAllBtn"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn"),
    domainFilterChips: document.querySelectorAll(".d-chip"),
    agentName: document.getElementById("agentName"),
    agentDesc: document.getElementById("agentDesc"),
    modelPill: document.getElementById("modelPill"),

    // File attachments
    addFileBtn: document.getElementById("addFileBtn"),
    fileOptionsMenu: document.getElementById("fileOptionsMenu"),
    optCamera: document.getElementById("optCamera"),
    optPhoto: document.getElementById("optPhoto"),
    optFiles: document.getElementById("optFiles"),
    photoInput: document.getElementById("photoInput"),
    fileInput: document.getElementById("fileInput"),
    attachmentPreviewBar: document.getElementById("attachmentPreviewBar"),
    attName: document.getElementById("attName"),
    attSize: document.getElementById("attSize"),
    removeAttBtn: document.getElementById("removeAttBtn"),

    // Exports
    exportZipBtn: document.getElementById("exportZipBtn"),
    exportDocxBtn: document.getElementById("exportDocxBtn"),
    exportPptxBtn: document.getElementById("exportPptxBtn"),
    exportXlsxBtn: document.getElementById("exportXlsxBtn"),

    // Recommendation Studio Sub-Navigation & Views
    recSubtabs: document.querySelectorAll(".rec-subtab"),
    recSubviews: document.querySelectorAll(".rec-subview"),
    suggestedVideosGrid: document.getElementById("suggestedVideosGrid"),
    physicsVideosGrid: document.getElementById("physicsVideosGrid"),
    chemistryVideosGrid: document.getElementById("chemistryVideosGrid"),
    mathVideosGrid: document.getElementById("mathVideosGrid"),
    suggestedTopicBadge: document.getElementById("suggestedTopicBadge"),

    // NCERT Explorer Elements
    ncertClassSelect: document.getElementById("ncertClassSelect"),
    ncertSubjectSelect: document.getElementById("ncertSubjectSelect"),
    ncertMediumSelect: document.getElementById("ncertMediumSelect"),
    ncertSearchInput: document.getElementById("ncertSearchInput"),
    ncertFilterBtn: document.getElementById("ncertFilterBtn"),
    ncertBooksGrid: document.getElementById("ncertBooksGrid"),

    // Research Papers Elements
    papersSearchInput: document.getElementById("papersSearchInput"),
    papersSearchBtn: document.getElementById("papersSearchBtn"),
    papersList: document.getElementById("papersList"),

    // Academic Books Elements
    booksSearchInput: document.getElementById("booksSearchInput"),
    booksDomainSelect: document.getElementById("booksDomainSelect"),
    booksSearchBtn: document.getElementById("booksSearchBtn"),
    booksResultsGrid: document.getElementById("booksResultsGrid"),

    // Inquiries & Practice Elements
    recQuestionsList: document.getElementById("recQuestionsList"),
    recPrereqList: document.getElementById("recPrereqList"),
    practiceProblemBox: document.getElementById("practiceProblemBox"),
    solvePracticeBtn: document.getElementById("solvePracticeBtn"),

    // Progress View
    statStreak: document.getElementById("statStreak"),
    statSolved: document.getElementById("statSolved"),
    statFocus: document.getElementById("statFocus"),
    statLevel: document.getElementById("statLevel"),
    barMathFill: document.getElementById("barMathFill"),
    barMathVal: document.getElementById("barMathVal"),
    barProgFill: document.getElementById("barProgFill"),
    barProgVal: document.getElementById("barProgVal"),
    barPhysFill: document.getElementById("barPhysFill"),
    barPhysVal: document.getElementById("barPhysVal"),
    barChemFill: document.getElementById("barChemFill"),
    barChemVal: document.getElementById("barChemVal"),
    barBioFill: document.getElementById("barBioFill"),
    barBioVal: document.getElementById("barBioVal"),
    conceptsListContainer: document.getElementById("conceptsListContainer"),

    // Learn & Quiz
    flashcardElement: document.getElementById("flashcardElement"),
    fcDomainBadge: document.getElementById("fcDomainBadge"),
    flashcardCounter: document.getElementById("flashcardCounter"),
    flashcardQuestion: document.getElementById("flashcardQuestion"),
    flashcardAnswer: document.getElementById("flashcardAnswer"),
    prevFlashcardBtn: document.getElementById("prevFlashcardBtn"),
    nextFlashcardBtn: document.getElementById("nextFlashcardBtn"),
    generateQuizBtn: document.getElementById("generateQuizBtn"),
    quizContainer: document.getElementById("quizContainer"),

    // Profile & Settings
    profileNameInput: document.getElementById("profileNameInput"),
    knowledgeLevelSelect: document.getElementById("knowledgeLevelSelect"),
    saveProfileBtn: document.getElementById("saveProfileBtn"),

    // Modals
    cameraModal: document.getElementById("cameraModal"),
    closeCameraBtn: document.getElementById("closeCameraBtn"),
    cameraVideo: document.getElementById("cameraVideo"),
    cameraCanvas: document.getElementById("cameraCanvas"),
    snapPhotoBtn: document.getElementById("snapPhotoBtn"),
    videoModal: document.getElementById("videoModal"),
    closeVideoBtn: document.getElementById("closeVideoBtn"),
    videoModalTitle: document.getElementById("videoModalTitle"),
    videoIframe: document.getElementById("videoIframe"),

    toast: document.getElementById("toast")
  };

  // ==========================================
  // Vector SVG Icons
  // ==========================================
  const ICONS = {
    youtube: `<svg class="official-logo-svg" viewBox="0 0 24 24" width="22" height="22"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    googleBooks: `<svg class="official-logo-svg" viewBox="0 0 24 24" width="22" height="22"><path fill="#4285F4" d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path fill="#FFFFFF" d="M6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"/></svg>`,
    citation: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    play: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    speak: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
  };

  // ==========================================
  // Helper: Toast Notification
  // ==========================================
  function showToast(msg, duration = 3000) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.style.display = "block";
    setTimeout(() => {
      els.toast.style.display = "none";
    }, duration);
  }

  // ==========================================
  // Reliable File Download (Fix for Export issue)
  // ==========================================
  async function downloadFile(url, filename) {
    showToast(`Generating ${filename}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Export request returned HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
      }, 1500);
      showToast(`Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error("Export download failed:", err);
      showToast("Download failed. Please check server logs.");
    }
  }

  els.exportZipBtn.addEventListener("click", () => downloadFile("/api/export/zip", "Phoenix_Academic_Context_Dossier.zip"));
  els.exportDocxBtn.addEventListener("click", () => downloadFile("/api/export/docx", "Phoenix_Academic_Context_Report.docx"));
  els.exportPptxBtn.addEventListener("click", () => downloadFile("/api/export/pptx", "Phoenix_Academic_Context_Presentation.pptx"));
  els.exportXlsxBtn.addEventListener("click", () => downloadFile("/api/export/xlsx", "Phoenix_Academic_Analytics_Workbook.xlsx"));

  // ==========================================
  // I18N Multilingual Translation System
  // ==========================================
  const I18N = {
    en: {
      engine_status: "Academic Research Engine",
      bw_mode: "B&W Mode",
      export_dossier: "Export Dossier:",
      export_zip: "Export ZIP",
      specialist_agent: "Specialist AI Agent",
      verified_engine: "Verified Academic Engine",
      nav_title: "Navigation",
      nav_tutor: "Tutor",
      nav_recommendation: "Recommendation",
      nav_progress: "Progress",
      nav_learn: "Learn",
      nav_profile: "Profile",
      nav_setting: "Setting",
      subtab_videos: "Video Masterclasses",
      subtab_ncert: "NCERT Textbooks",
      subtab_papers: "Research Papers",
      subtab_books: "Academic Books",
      subtab_inquiries: "Inquiry Pathways",
      rec_header_title: "Academic Recommendation & Research Studio",
      rec_header_subtitle: "Curated Video Masterclasses, Official NCERT Textbooks, arXiv Research Papers, and Academic Books tailored to your academic inquiries.",
      vids_suggested_title: "Suggested For Your Active Inquiries",
      vids_physics_title: "Physics & Quantum Mechanics Masterclasses",
      vids_chemistry_title: "Chemistry & Molecular Sciences Masterclasses",
      vids_math_title: "Mathematics & Rigorous Proofs Masterclasses",
      ncert_lbl_class: "Class",
      ncert_lbl_subject: "Subject",
      ncert_lbl_medium: "Medium",
      ncert_lbl_search: "Search Books",
      ncert_btn_explore: "Explore",
      paper_btn_search: "Search Papers",
      books_btn_search: "Search Books",
      rec_next_inquiries: "Next Academic Inquiries",
      rec_click_inquiry: "Click any inquiry below to immediately load it into the Tutor Engine for a complete derivation:",
      rec_prereq: "Prerequisite Knowledge Modules",
      rec_practice: "Curated Practice Challenge",
      btn_load_tutor: "Load into Tutor Engine →",
      settings_header_title: "Platform Configuration & Academic Pipelines",
      settings_header_subtitle: "Customize platform appearance, language transformation, and inspect connected academic repositories.",
      settings_lbl_appearance: "Display Appearance Mode:",
      settings_bw_title: "Black & White Monochrome Mode",
      settings_bw_sub: "High-contrast academic print aesthetic, optimized for distraction-free reading",
      settings_lbl_language: "Platform Language Transformation:",
      settings_lbl_pipelines: "Integrated Academic Pipelines:",
      settings_btn_clear: "Clear All Session History",
      input_placeholder: "Ask an academic question or submit a complex problem for derivation...",
      search_history_placeholder: "Search past inquiries..."
    },
    hi: {
      engine_status: "अकादमिक अनुसंधान इंजन",
      bw_mode: "श्वेत-श्याम मोड",
      export_dossier: "डोज़ियर निर्यात करें:",
      export_zip: "ज़िप निर्यात",
      specialist_agent: "विशेषज्ञ अकादमिक एजेंट",
      verified_engine: "सत्यापित अकादमिक इंजन",
      nav_title: "नेविगेशन",
      nav_tutor: "शिक्षक",
      nav_recommendation: "सिफारिशें",
      nav_progress: "प्रगति",
      nav_learn: "सीखें",
      nav_profile: "प्रोफ़ाइल",
      nav_setting: "सेटिंग्स",
      subtab_videos: "वीडियो लेक्चर्स",
      subtab_ncert: "एनसीईआरटी पाठ्यपुस्तकें",
      subtab_papers: "शोध पत्र (arXiv)",
      subtab_books: "अकादमिक पुस्तकें",
      subtab_inquiries: "अध्ययन मार्ग",
      rec_header_title: "अकादमिक अनुशंसा एवं अनुसंधान स्टूडियो",
      rec_header_subtitle: "आपके प्रश्नों के अनुरूप चयनित वीडियो लेक्चर्स, एनसीईआरटी पुस्तकें, शोध पत्र और संदर्भ ग्रंथ।",
      vids_suggested_title: "आपकी वर्तमान जिज्ञासाओं के लिए अनुशंसित",
      vids_physics_title: "भौतिकी एवं क्वांटम यांत्रिकी मास्टरक्लास",
      vids_chemistry_title: "रसायन विज्ञान एवं आणविक विज्ञान मास्टरक्लास",
      vids_math_title: "गणित एवं सैद्धांतिक प्रमाण मास्टरक्लास",
      ncert_lbl_class: "कक्षा",
      ncert_lbl_subject: "विषय",
      ncert_lbl_medium: "माध्यम",
      ncert_lbl_search: "पुस्तक खोजें",
      ncert_btn_explore: "खोजें",
      paper_btn_search: "शोध पत्र खोजें",
      books_btn_search: "पुस्तकें खोजें",
      rec_next_inquiries: "आगामी शैक्षणिक प्रश्न",
      rec_click_inquiry: "पूरी व्याख्या और हल के लिए किसी भी प्रश्न पर क्लिक करें:",
      rec_prereq: "आवश्यक पूर्व ज्ञान मॉड्यूल",
      rec_practice: "अभ्यास चुनौती",
      btn_load_tutor: "शिक्षक इंजन में लोड करें →",
      settings_header_title: "प्लेटफ़ॉर्म कॉन्फ़िगरेशन एवं शैक्षणिक पाइपलाइन",
      settings_header_subtitle: "प्लेटफ़ॉर्म का स्वरूप, भाषा बदलें और शैक्षणिक स्रोतों का निरीक्षण करें।",
      settings_lbl_appearance: "प्रदर्शन स्वरूप मोड:",
      settings_bw_title: "ब्लैक एंड व्हाइट मोनोक्रोम मोड",
      settings_bw_sub: "उच्च-कंट्रास्ट अकादमिक प्रिंट शैली, एकाग्रता हेतु अनुकूलित",
      settings_lbl_language: "संपूर्ण प्लेटफ़ॉर्म भाषा परिवर्तन:",
      settings_lbl_pipelines: "एकीकृत शैक्षणिक पाइपलाइनें:",
      settings_btn_clear: "समस्त सत्र इतिहास साफ़ करें",
      input_placeholder: "कोई भी शैक्षणिक प्रश्न या समस्या विस्तार से हल करने के लिए दर्ज करें...",
      search_history_placeholder: "पूर्व प्रश्नों में खोजें..."
    },
    es: {
      engine_status: "Motor de Investigación Académica",
      bw_mode: "Modo B/N",
      export_dossier: "Exportar Expediente:",
      export_zip: "Exportar ZIP",
      specialist_agent: "Agente Académico Especialista",
      verified_engine: "Motor Académico Verificado",
      nav_title: "Navegación",
      nav_tutor: "Tutor",
      nav_recommendation: "Recomendaciones",
      nav_progress: "Progreso",
      nav_learn: "Aprender",
      nav_profile: "Perfil",
      nav_setting: "Ajustes",
      subtab_videos: "Clases en Video",
      subtab_ncert: "Libros NCERT",
      subtab_papers: "Artículos de Investigación",
      subtab_books: "Libros Académicos",
      subtab_inquiries: "Vías de Indagación",
      rec_header_title: "Estudio de Recomendación e Investigación Académica",
      rec_header_subtitle: "Lecciones en video seleccionadas, libros NCERT, artículos de arXiv y libros académicos adaptados a sus consultas.",
      vids_suggested_title: "Sugerido Para Sus Consultas Activas",
      vids_physics_title: "Clases Magistrales de Física y Cuántica",
      vids_chemistry_title: "Clases Magistrales de Química y Ciencias Moleculares",
      vids_math_title: "Clases Magistrales de Matemáticas y Demostraciones",
      ncert_lbl_class: "Clase",
      ncert_lbl_subject: "Materia",
      ncert_lbl_medium: "Idioma",
      ncert_lbl_search: "Buscar Libros",
      ncert_btn_explore: "Explorar",
      paper_btn_search: "Buscar Artículos",
      books_btn_search: "Buscar Libros",
      rec_next_inquiries: "Próximas Consultas Académicas",
      rec_click_inquiry: "Haga clic en cualquier consulta para cargarla en el Motor Tutor:",
      rec_prereq: "Módulos de Conocimiento Prerrequisito",
      rec_practice: "Desafío de Práctica Seleccionado",
      btn_load_tutor: "Cargar en el Tutor →",
      settings_header_title: "Configuración de Plataforma y Canales Académicos",
      settings_header_subtitle: "Personalice la apariencia, la transformación de idioma e inspeccione los repositorios académicos.",
      settings_lbl_appearance: "Modo de Apariencia:",
      settings_bw_title: "Modo Blanco y Negro Monocromo",
      settings_bw_sub: "Estética de impresión académica de alto contraste para lectura sin distracciones",
      settings_lbl_language: "Transformación de Idioma de la Plataforma:",
      settings_lbl_pipelines: "Canales Académicos Integrados:",
      settings_btn_clear: "Borrar Todo el Historial de Sesión",
      input_placeholder: "Haga una pregunta académica o ingrese un problema complejo para resolver...",
      search_history_placeholder: "Buscar consultas anteriores..."
    },
    fr: {
      engine_status: "Moteur de Recherche Académique",
      bw_mode: "Mode N&B",
      export_dossier: "Exporter Dossier :",
      export_zip: "Exporter ZIP",
      specialist_agent: "Agent Spécialiste Académique",
      verified_engine: "Moteur Académique Vérifié",
      nav_title: "Navigation",
      nav_tutor: "Tuteur",
      nav_recommendation: "Recommandations",
      nav_progress: "Progrès",
      nav_learn: "Apprendre",
      nav_profile: "Profil",
      nav_setting: "Paramètres",
      subtab_videos: "Cours Vidéo",
      subtab_ncert: "Manuels NCERT",
      subtab_papers: "Articles de Recherche",
      subtab_books: "Livres Académiques",
      subtab_inquiries: "Parcours d'Étude",
      rec_header_title: "Studio de Recommandation et Recherche Académique",
      rec_header_subtitle: "Cours vidéo sélectionnés, manuels NCERT, articles de recherche arXiv et livres académiques personnalisés.",
      vids_suggested_title: "Suggéré Pour Vos Requêtes Actives",
      vids_physics_title: "Masterclasses de Physique et Mécanique Quantique",
      vids_chemistry_title: "Masterclasses de Chimie et Sciences Moléculaires",
      vids_math_title: "Masterclasses de Mathématiques et Démonstrations",
      ncert_lbl_class: "Classe",
      ncert_lbl_subject: "Matière",
      ncert_lbl_medium: "Langue",
      ncert_lbl_search: "Rechercher",
      ncert_btn_explore: "Explorer",
      paper_btn_search: "Rechercher Articles",
      books_btn_search: "Rechercher Livres",
      rec_next_inquiries: "Prochaines Requêtes Académiques",
      rec_click_inquiry: "Cliquez sur une requête pour la charger dans le moteur Tuteur :",
      rec_prereq: "Modules Prérequis Recommandés",
      rec_practice: "Défi d'Entraînement Recommandé",
      btn_load_tutor: "Charger dans le Tuteur →",
      settings_header_title: "Configuration et Pipelines Académiques",
      settings_header_subtitle: "Personnalisez l'apparence, changez la langue et inspectez les dépôts académiques.",
      settings_lbl_appearance: "Mode d'Affichage :",
      settings_bw_title: "Mode Noir & Blanc Monochrome",
      settings_bw_sub: "Esthétique d'impression académique à fort contraste pour une lecture concentrée",
      settings_lbl_language: "Transformation de Langue de la Plateforme :",
      settings_lbl_pipelines: "Pipelines Académiques Intégrés :",
      settings_btn_clear: "Effacer Tout l'Historique de Session",
      input_placeholder: "Posez une question académique ou soumettez un problème complexe...",
      search_history_placeholder: "Rechercher dans l'historique..."
    },
    de: {
      engine_status: "Akademische Forschungs-Engine",
      bw_mode: "S/W Modus",
      export_dossier: "Dossier Exportieren:",
      export_zip: "ZIP Export",
      specialist_agent: "Akademischer Spezialisten-Agent",
      verified_engine: "Verifizierte Akademische Engine",
      nav_title: "Navigation",
      nav_tutor: "Tutor",
      nav_recommendation: "Empfehlungen",
      nav_progress: "Fortschritt",
      nav_learn: "Lernen",
      nav_profile: "Profil",
      nav_setting: "Einstellungen",
      subtab_videos: "Video-Vorlesungen",
      subtab_ncert: "NCERT Lehrbücher",
      subtab_papers: "Forschungsarbeiten",
      subtab_books: "Akademische Bücher",
      subtab_inquiries: "Forschungspfade",
      rec_header_title: "Akademisches Empfehlungs- & Forschungsstudio",
      rec_header_subtitle: "Kuratierte Video-Vorlesungen, offizielle NCERT-Lehrbücher, arXiv-Forschungsarbeiten und Fachbücher.",
      vids_suggested_title: "Empfohlen Für Ihre Aktiven Fragen",
      vids_physics_title: "Physik & Quantenmechanik Masterclasses",
      vids_chemistry_title: "Chemie & Molekularwissenschaften Masterclasses",
      vids_math_title: "Mathematik & Rigorose Beweise Masterclasses",
      ncert_lbl_class: "Klasse",
      ncert_lbl_subject: "Fach",
      ncert_lbl_medium: "Sprache",
      ncert_lbl_search: "Buch Suchen",
      ncert_btn_explore: "Erkunden",
      paper_btn_search: "Arbeiten Suchen",
      books_btn_search: "Bücher Suchen",
      rec_next_inquiries: "Nächste Akademische Fragen",
      rec_click_inquiry: "Klicken Sie auf eine Frage, um sie direkt in den Tutor zu laden:",
      rec_prereq: "Empfohlene Vorkenntnis-Module",
      rec_practice: "Kuratierte Übungsaufgabe",
      btn_load_tutor: "In den Tutor Laden →",
      settings_header_title: "Plattform-Konfiguration & Akademische Pipelines",
      settings_header_subtitle: "Passen Sie das Erscheinungsbild an, transformieren Sie die Sprache und prüfen Sie verbundene Archive.",
      settings_lbl_appearance: "Erscheinungsbild-Modus:",
      settings_bw_title: "Schwarz-Weiß Monochrom-Modus",
      settings_bw_sub: "Kontrastreiche akademische Druckästhetik für ablenkungsfreies Lesen",
      settings_lbl_language: "Plattformweite Sprach-Transformation:",
      settings_lbl_pipelines: "Integrierte Akademische Pipelines:",
      settings_btn_clear: "Gesamten Sitzungsverlauf Löschen",
      input_placeholder: "Stellen Sie eine wissenschaftliche Frage oder geben Sie eine Aufgabe zur Herleitung ein...",
      search_history_placeholder: "Vergangene Fragen durchsuchen..."
    }
  };

  function applyLanguage(lang) {
    state.language = lang;
    localStorage.setItem("phoenix_lang", lang);
    if (els.langSelect) els.langSelect.value = lang;
    if (els.settingLangSelect) els.settingLangSelect.value = lang;

    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (els.questionInput && dict.input_placeholder) els.questionInput.placeholder = dict.input_placeholder;
    if (els.chatSearchInput && dict.search_history_placeholder) els.chatSearchInput.placeholder = dict.search_history_placeholder;
  }

  function toggleBwMode(enable) {
    if (enable === undefined) {
      enable = !document.body.classList.contains("bw-mode");
    }
    state.bwMode = enable;
    if (enable) {
      document.body.classList.add("bw-mode");
      localStorage.setItem("phoenix_bw_mode", "true");
      if (els.bwToggleText) els.bwToggleText.textContent = "Color Mode";
      if (els.settingBwText) els.settingBwText.textContent = "Color Mode";
    } else {
      document.body.classList.remove("bw-mode");
      localStorage.setItem("phoenix_bw_mode", "false");
      const label = (I18N[state.language] || I18N.en).bw_mode;
      if (els.bwToggleText) els.bwToggleText.textContent = label;
      if (els.settingBwText) els.settingBwText.textContent = label;
    }
  }

  // ==========================================
  // KaTeX & Markdown Rendering Helper
  // ==========================================
  function renderRichContent(element) {
    if (window.renderMathInElement) {
      renderMathInElement(element, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
    if (window.hljs) {
      element.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }

  // ==========================================
  // Navigation: Full-Screen Window Switching
  // ==========================================
  function switchMode(newMode) {
    state.activeMode = newMode;

    // Update active nav button
    els.navButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-nav") === newMode);
    });

    // Hide all workspaces
    els.viewTutor.style.display = "none";
    els.viewRecommendation.classList.remove("active");
    els.viewProgress.classList.remove("active");
    els.viewLearn.classList.remove("active");
    els.viewProfile.classList.remove("active");
    els.viewSetting.classList.remove("active");

    if (newMode === "tutor") {
      els.viewTutor.style.display = "flex";
      // Ensure smooth scroll to active answer if present
      const lastAnswer = els.chatMessages.querySelector(".msg-assistant:last-child");
      if (lastAnswer) {
        lastAnswer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (newMode === "recommendation") {
      els.viewRecommendation.classList.add("active");
      renderRecommendationDashboard();
      loadCategorizedVideos();
      filterNcertBooks();
      searchResearchPapers();
      searchAcademicBooks();
    } else if (newMode === "progress") {
      els.viewProgress.classList.add("active");
      loadProfile();
    } else if (newMode === "learn") {
      els.viewLearn.classList.add("active");
      updateFlashcardView();
    } else if (newMode === "profile") {
      els.viewProfile.classList.add("active");
      loadProfile();
    } else if (newMode === "setting") {
      els.viewSetting.classList.add("active");
    }
  }

  els.navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-nav");
      switchMode(mode);
    });
  });

  // ==========================================
  // Dynamic Recommendation Dashboard (No Hardcoding)
  // ==========================================
  async function renderRecommendationDashboard() {
    const activeQuestion = state.currentRecord ? state.currentRecord.question : 
      (state.history.length > 0 ? state.history[0].question : "Quantum Mechanics and Dynamic Programming");
    const activeDomain = state.currentRecord ? state.currentRecord.domain : "general";

    els.recQuestionsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">Synthesizing recommendations via AI...</div>`;

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeQuestion, domain: activeDomain })
      });

      if (res.ok) {
        const data = await res.json();
        const recs = data.recommendations;

        // Populate next questions
        els.recQuestionsList.innerHTML = recs.next_questions.map(q => `
          <button class="rec-action-item" data-query="${escapeHtml(q)}">
            <span>${escapeHtml(q)}</span>
            <span style="font-weight: 700; color: var(--forest-green);">Solve →</span>
          </button>
        `).join("");

        // Attach click to ask directly in tutor
        els.recQuestionsList.querySelectorAll(".rec-action-item").forEach(btn => {
          btn.addEventListener("click", () => {
            const queryText = btn.getAttribute("data-query");
            switchMode("tutor");
            els.questionInput.value = queryText;
            submitQuestion();
          });
        });

        // Populate prerequisites
        els.recPrereqList.innerHTML = recs.prerequisites.map(p => `
          <div class="rec-action-item" style="cursor: default;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="dot-green"></span>
              <strong>${escapeHtml(p)}</strong>
            </div>
            <span class="badge">Prerequisite</span>
          </div>
        `).join("");

        // Practice challenge
        if (recs.practice_problems && recs.practice_problems.length > 0) {
          const practiceQ = recs.practice_problems[0];
          els.practiceProblemBox.innerHTML = `<strong>Challenge Problem:</strong><br>${escapeHtml(practiceQ)}`;
          els.solvePracticeBtn.onclick = () => {
            switchMode("tutor");
            els.questionInput.value = practiceQ;
            submitQuestion();
          };
        }
      }
    } catch (e) {
      console.error(e);
      els.recQuestionsList.innerHTML = `<div style="color: var(--text-muted);">Inference connection busy. Please retry.</div>`;
    }
  }

  // ==========================================
  // Pipeline 1: Categorized Video Masterclasses
  // ==========================================
  async function loadCategorizedVideos(topic) {
    try {
      let url = "/api/recommendations/categorized-videos";
      if (topic) url += `?topic=${encodeURIComponent(topic)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      
      if (els.suggestedTopicBadge && data.suggested_topic) {
        els.suggestedTopicBadge.textContent = data.suggested_topic.slice(0, 35) + "...";
      }

      function renderVideoCards(container, vids) {
        if (!container) return;
        if (!vids || vids.length === 0) {
          container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">No lectures retrieved.</div>`;
          return;
        }
        container.innerHTML = vids.map(v => `
          <div class="video-card">
            <div class="video-thumb-wrap" data-embed="${v.embed_url || ''}" data-url="${v.url || ''}" data-title="${escapeHtml(v.title)}">
              <img src="${v.thumbnail || ''}" alt="${escapeHtml(v.title)}" class="video-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'" />
              <div class="video-play-badge">
                ${ICONS.play}
              </div>
            </div>
            <div class="video-card-body">
              <div class="video-card-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
              <div class="video-card-channel">
                ${ICONS.youtube}
                <span>${escapeHtml(v.channel || 'Educational Channel')}</span>
              </div>
            </div>
          </div>
        `).join("");

        container.querySelectorAll(".video-thumb-wrap").forEach(card => {
          card.addEventListener("click", () => {
            const embed = card.getAttribute("data-embed");
            const url = card.getAttribute("data-url");
            const title = card.getAttribute("data-title");
            if (embed) {
              openVideoModal(embed, title);
            } else if (url) {
              window.open(url, "_blank");
            }
          });
        });
      }

      renderVideoCards(els.suggestedVideosGrid, data.suggested);
      renderVideoCards(els.physicsVideosGrid, data.physics);
      renderVideoCards(els.chemistryVideosGrid, data.chemistry);
      renderVideoCards(els.mathVideosGrid, data.math);
    } catch (e) {
      console.error("Failed to load categorized videos:", e);
    }
  }

  // ==========================================
  // Pipeline 2: NCERT Textbook Explorer
  // ==========================================
  async function filterNcertBooks() {
    if (!els.ncertBooksGrid) return;
    els.ncertBooksGrid.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 20px;">Fetching verified NCERT catalog...</div>`;
    
    try {
      const cls = els.ncertClassSelect ? els.ncertClassSelect.value : "";
      const subj = els.ncertSubjectSelect ? els.ncertSubjectSelect.value : "all";
      const med = els.ncertMediumSelect ? els.ncertMediumSelect.value : "all";
      const q = els.ncertSearchInput ? els.ncertSearchInput.value.trim() : "";

      let params = new URLSearchParams();
      if (cls) params.append("class_num", cls);
      if (subj && subj !== "all") params.append("subject", subj);
      if (med && med !== "all") params.append("medium", med);
      if (q) params.append("query", q);

      const res = await fetch(`/api/ncert/books?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch NCERT books");
      const data = await res.json();

      if (!data.books || data.books.length === 0) {
        els.ncertBooksGrid.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem; padding: 30px; text-align: center;">No textbooks match your query. Try selecting 'All Classes' or 'All Subjects'.</div>`;
        return;
      }

      els.ncertBooksGrid.innerHTML = data.books.map(b => `
        <div class="ncert-card">
          <div>
            <div class="ncert-card-header">
              <div class="ncert-badge-group">
                <span class="ncert-badge-class">Class ${b.class_num}</span>
                <span class="ncert-badge-medium">${b.language}</span>
                ${b.part ? `<span class="ncert-badge-medium">Part ${b.part}</span>` : ''}
              </div>
            </div>
            <div class="ncert-card-title">${escapeHtml(b.title)}</div>
            <div class="ncert-card-subject">Subject: ${escapeHtml(b.subject)}</div>
          </div>
          <a href="${b.url}" target="_blank" download class="btn-ncert-download">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Official NCERT PDF
          </a>
        </div>
      `).join("");
    } catch (e) {
      console.error("NCERT fetch error:", e);
      els.ncertBooksGrid.innerHTML = `<div style="color: var(--terracotta);">Failed to query NCERT catalog.</div>`;
    }
  }

  // ==========================================
  // Pipeline 3: Research Papers Finder (arXiv & Semantic Scholar)
  // ==========================================
  async function searchResearchPapers(query) {
    if (!els.papersList) return;
    const q = query || (els.papersSearchInput ? els.papersSearchInput.value.trim() : "") || (state.currentRecord ? state.currentRecord.question : "Quantum Mechanics and Relativity");
    if (els.papersSearchInput && !els.papersSearchInput.value) els.papersSearchInput.value = q;
    
    els.papersList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 20px;">Querying arXiv & Semantic Scholar official APIs...</div>`;
    
    try {
      const res = await fetch(`/api/papers/search?query=${encodeURIComponent(q)}&max_results=6`);
      if (!res.ok) throw new Error("Papers API error");
      const data = await res.json();
      
      if (!data.papers || data.papers.length === 0) {
        els.papersList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.9rem; padding: 20px;">No papers returned for "${escapeHtml(q)}". Try broader search terms.</div>`;
        return;
      }

      els.papersList.innerHTML = data.papers.map(p => `
        <div class="paper-card">
          <div class="paper-card-top">
            <h4 class="paper-title">${escapeHtml(p.title)}</h4>
            <span class="paper-source-badge">${escapeHtml(p.source || 'arXiv')}</span>
          </div>
          <div class="paper-meta-row">
            <span><strong>Authors:</strong> ${(p.authors || []).slice(0, 3).join(", ")}${p.authors && p.authors.length > 3 ? ' et al.' : ''}</span>
            ${p.year ? `<span>• <strong>Year:</strong> ${p.year}</span>` : ''}
            ${p.citation_count !== null && p.citation_count !== undefined ? `<span>• <strong>Citations:</strong> ${p.citation_count}</span>` : ''}
          </div>
          <p class="paper-abstract">${escapeHtml(p.abstract || '')}</p>
          <div class="paper-actions-row">
            <a href="${p.url}" target="_blank" class="btn-paper-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Official Abstract Page
            </a>
            ${p.pdf_url ? `
              <a href="${p.pdf_url}" target="_blank" class="btn-paper-link" style="color: var(--terracotta);">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Direct Open-Access PDF
              </a>
            ` : ''}
          </div>
        </div>
      `).join("");
    } catch (e) {
      console.error("Paper search error:", e);
      els.papersList.innerHTML = `<div style="color: var(--terracotta);">Failed to query research papers.</div>`;
    }
  }

  // ==========================================
  // Pipeline 4: Academic Books Explorer (Google Books Search & Dropdown)
  // ==========================================
  async function searchAcademicBooks(query, domain) {
    if (!els.booksResultsGrid) return;
    const q = query || (els.booksSearchInput ? els.booksSearchInput.value.trim() : "") || (state.currentRecord ? state.currentRecord.question : "Physics Principles");
    const d = domain || (els.booksDomainSelect ? els.booksDomainSelect.value : "all");
    if (els.booksSearchInput && !els.booksSearchInput.value) els.booksSearchInput.value = q;
    
    els.booksResultsGrid.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.85rem; padding: 20px;">Searching Google Books repository...</div>`;
    
    try {
      const res = await fetch(`/api/books/search?query=${encodeURIComponent(q)}&domain=${encodeURIComponent(d)}&max_results=6`);
      if (!res.ok) throw new Error("Books API error");
      const data = await res.json();

      if (!data.books || data.books.length === 0) {
        els.booksResultsGrid.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem; padding: 20px;">No books found for "${escapeHtml(q)}".</div>`;
        return;
      }

      els.booksResultsGrid.innerHTML = data.books.map(b => `
        <div class="book-card-item">
          <img src="${b.thumbnail || ''}" alt="${escapeHtml(b.title)}" class="book-card-cover" onerror="this.src='https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=400&auto=format&fit=crop&q=80'" />
          <div class="book-card-info">
            <div>
              <div class="book-card-name">${escapeHtml(b.title)}</div>
              <div class="book-card-authors">By ${escapeHtml(b.authors || 'Academic Scholars')}</div>
              <div class="book-card-pages">${escapeHtml(b.page_ref || '')}</div>
              <div style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(b.snippet || '')}</div>
            </div>
            ${b.preview_link ? `
              <a href="${b.preview_link}" target="_blank" class="btn-book-preview">
                Preview in Google Books →
              </a>
            ` : ''}
          </div>
        </div>
      `).join("");
    } catch (e) {
      console.error("Books search error:", e);
      els.booksResultsGrid.innerHTML = `<div style="color: var(--terracotta);">Failed to query Google Books.</div>`;
    }
  }

  // ==========================================
  // API: Load History & Profile
  // ==========================================
  async function loadHistory() {
    try {
      const filter = state.activeDomainFilter;
      const search = els.chatSearchInput.value.trim();
      let url = `/api/history?domain=${filter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        state.history = data.history || [];
        renderHistorySidebar();
      }
    } catch (e) {
      console.error("Error loading history:", e);
    }
  }

  async function loadProfile() {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        state.userProfile = data;
        updateProfileAndProgressUI();
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  }

  function updateProfileAndProgressUI() {
    const p = state.userProfile;
    if (!p) return;

    if (els.statStreak) els.statStreak.textContent = p.streak_days || 5;
    if (els.statSolved) els.statSolved.textContent = (state.history.length || 0) + (p.total_questions || 0);
    if (els.statFocus) els.statFocus.textContent = `${p.focus_score || 96}%`;
    if (els.statLevel) els.statLevel.textContent = p.knowledge_level || "Advanced";

    if (els.profileNameInput) els.profileNameInput.value = p.user_name || "Academic Scholar";
    if (els.knowledgeLevelSelect) els.knowledgeLevelSelect.value = p.knowledge_level || "Advanced";

    const m = p.domain_mastery || {};
    if (els.barMathVal) els.barMathVal.textContent = `${m.math || 82}%`;
    if (els.barMathFill) els.barMathFill.style.width = `${m.math || 82}%`;

    if (els.barProgVal) els.barProgVal.textContent = `${m.programming || 88}%`;
    if (els.barProgFill) els.barProgFill.style.width = `${m.programming || 88}%`;

    if (els.barPhysVal) els.barPhysVal.textContent = `${m.physics || 76}%`;
    if (els.barPhysFill) els.barPhysFill.style.width = `${m.physics || 76}%`;

    if (els.barChemVal) els.barChemVal.textContent = `${m.chemistry || 70}%`;
    if (els.barChemFill) els.barChemFill.style.width = `${m.chemistry || 70}%`;

    if (els.barBioVal) els.barBioVal.textContent = `${m.biology || 74}%`;
    if (els.barBioFill) els.barBioFill.style.width = `${m.biology || 74}%`;

    if (els.conceptsListContainer && p.concepts_mastered) {
      els.conceptsListContainer.innerHTML = p.concepts_mastered.map(c => `
        <div class="rec-action-item" style="cursor: default;">
          <span>${c}</span>
          <span class="badge">Mastered</span>
        </div>
      `).join("");
      renderRichContent(els.conceptsListContainer);
    }
  }

  // ==========================================
  // Render History Sidebar
  // ==========================================
  function renderHistorySidebar() {
    els.historyCountBadge.textContent = state.history.length;

    if (state.history.length === 0) {
      els.historyListContainer.innerHTML = `
        <div class="history-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <p>No history records found.<br>Submit your first academic problem.</p>
        </div>
      `;
      return;
    }

    els.historyListContainer.innerHTML = state.history.map(item => {
      const isActive = state.currentRecord && state.currentRecord.id === item.id;
      return `
        <div class="history-item ${isActive ? 'active' : ''}" data-id="${item.id}">
          <div class="history-item-content">
            <span class="history-subject-badge">${item.subject || item.domain || 'General'}</span>
            <div class="history-question-text" title="${escapeHtml(item.question)}">${escapeHtml(item.question)}</div>
            <span class="history-time-text">${item.timestamp_display || ''}</span>
          </div>
          <button class="btn-del-history" data-del-id="${item.id}" title="Delete record">×</button>
        </div>
      `;
    }).join("");

    // Click events
    els.historyListContainer.querySelectorAll(".history-item").forEach(div => {
      div.addEventListener("click", (e) => {
        if (e.target.closest(".btn-del-history")) return;
        const recordId = div.getAttribute("data-id");
        switchMode("tutor");
        displayRecord(recordId);
      });
    });

    els.historyListContainer.querySelectorAll(".btn-del-history").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-del-id");
        await deleteHistoryItem(id);
      });
    });
  }

  async function deleteHistoryItem(id) {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Record removed");
        if (state.currentRecord && state.currentRecord.id === id) {
          state.currentRecord = null;
          showWelcome();
        }
        await loadHistory();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ==========================================
  // Display Q&A Record in Center Area
  // ==========================================
  function displayRecord(recordId) {
    let rec = state.history.find(r => r.id === recordId || r.record_id === recordId);
    if (!rec && state.currentRecord && (state.currentRecord.id === recordId || state.currentRecord.record_id === recordId)) {
      rec = state.currentRecord;
    }
    if (!rec && state.history.length > 0) {
      rec = state.history[0];
    }
    if (!rec) return;

    state.currentRecord = rec;
    renderHistorySidebar();

    // Update Agent Header
    if (els.agentName) els.agentName.textContent = rec.agent_used || "Specialist Agent";
    if (els.agentDesc) els.agentDesc.textContent = rec.speciality_notes || "Rigorous Scientific Derivation & Sources";
    if (els.modelPill) els.modelPill.textContent = (I18N[state.language] || I18N.en).verified_engine || "Verified Academic Engine";

    els.chatMessages.innerHTML = "";

    // 1. User Message
    const userMsg = document.createElement("div");
    userMsg.className = "msg-row";
    userMsg.innerHTML = `
      <div class="msg-user">
        <div class="msg-user-header">
          <span class="msg-user-title">PROBLEM QUERY</span>
          <span class="msg-user-time">${rec.timestamp_display || ''}</span>
        </div>
        <div class="msg-user-text">${escapeHtml(rec.question)}</div>
        ${rec.attachments && rec.attachments.length ? `
          <div class="msg-user-att-chip">📎 ${rec.attachments[0].label}</div>
        ` : ''}
      </div>
    `;
    els.chatMessages.appendChild(userMsg);

    // 2. Assistant Message Card
    const asstMsg = document.createElement("div");
    asstMsg.className = `msg-row ${rec.is_penalty ? 'penalty-msg' : ''}`;

    let parsedMarkdown = window.marked ? marked.parse(rec.answer) : rec.answer;

    // Build YouTube Video Cards HTML with Official SVG
    let videosHtml = "";
    if (rec.videos && rec.videos.length > 0) {
      videosHtml = `
        <div class="resources-section">
          <div class="resource-group-title">
            ${ICONS.youtube}
            <span>Recommended Video Lectures (YouTube Data API)</span>
          </div>
          <div class="video-grid">
            ${rec.videos.map(v => `
              <div class="video-card" data-video-id="${v.id}" data-embed="${v.embed_url || ''}" data-url="${v.url}" data-title="${escapeHtml(v.title)}">
                <div class="video-thumb-wrap">
                  <img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" class="video-thumb-img" />
                  <div class="video-play-overlay">${ICONS.play}</div>
                </div>
                <div class="video-info">
                  <div class="video-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                  <div class="video-channel">${escapeHtml(v.channel)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Build Google Books Cards HTML with Official SVG & highlighted page/snippet
    let booksHtml = "";
    if (rec.books && rec.books.length > 0) {
      booksHtml = `
        <div class="resources-section">
          <div class="resource-group-title">
            ${ICONS.googleBooks}
            <span>Curated Academic Textbooks & Relevant Pages (Google Books API)</span>
          </div>
          <div class="books-grid">
            ${rec.books.map(b => `
              <div class="book-card">
                <img src="${b.thumbnail}" alt="${escapeHtml(b.title)}" class="book-cover-img" />
                <div class="book-info">
                  <div class="book-title" title="${escapeHtml(b.title)}">${escapeHtml(b.title)}</div>
                  <div class="book-authors">${escapeHtml(b.authors)} (${escapeHtml(b.publishedDate)})</div>
                  <div class="book-page-badge">${escapeHtml(b.relevant_page_info)}</div>
                  <div class="book-snippet-text" title="${escapeHtml(b.snippet)}">"${escapeHtml(b.snippet)}"</div>
                  <a href="${b.previewLink}" target="_blank" rel="noopener" class="book-preview-link">Explore Preview on Google Books →</a>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Build References HTML
    let refsHtml = "";
    if (rec.references && rec.references.length > 0) {
      refsHtml = `
        <div class="resources-section">
          <div class="resource-group-title">
            ${ICONS.citation}
            <span>Academic Citations & Bibliography</span>
          </div>
          <div class="references-list">
            ${rec.references.map(r => `
              <div class="ref-item">
                <span>${escapeHtml(r.citation)}</span>
                <a href="${r.doi_url}" target="_blank" rel="noopener" class="ref-link">Source DOI →</a>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    asstMsg.innerHTML = `
      <div class="msg-assistant ${rec.is_penalty ? 'penalty-card' : ''}">
        <div class="msg-agent-header">
          <div class="agent-badge-info">
            <span class="agent-badge-name">${rec.agent_used || 'Specialist Agent'}</span>
            <span class="agent-meta-tag">${rec.subject || rec.domain}</span>
          </div>
          <span class="badge">Verified Derivation</span>
        </div>

        <!-- Rendered LaTeX & Markdown Solution -->
        <div class="markdown-body">
          ${parsedMarkdown}
        </div>

        <!-- Attached Multimedia Resources -->
        ${videosHtml}
        ${booksHtml}
        ${refsHtml}

        <!-- Toolbar: Copy, Speak -->
        <div class="msg-toolbar">
          <button class="btn-tool btn-copy-md" title="Copy Markdown with LaTeX">
            ${ICONS.copy}
            <span>Copy Markdown</span>
          </button>
          <button class="btn-tool btn-speak" title="Read solution aloud">
            ${ICONS.speak}
            <span>Read Aloud</span>
          </button>
        </div>
      </div>
    `;

    els.chatMessages.appendChild(asstMsg);

    // Apply KaTeX math rendering and code highlighting
    renderRichContent(asstMsg);

    // Toolbar Listeners
    const copyBtn = asstMsg.querySelector(".btn-copy-md");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(rec.answer);
        showToast("Copied to clipboard!");
      });
    }

    const speakBtn = asstMsg.querySelector(".btn-speak");
    if (speakBtn) {
      speakBtn.addEventListener("click", () => speakText(rec.answer));
    }

    // Video Card Modal Triggers
    asstMsg.querySelectorAll(".video-card").forEach(card => {
      card.addEventListener("click", () => {
        const embedUrl = card.getAttribute("data-embed");
        const videoUrl = card.getAttribute("data-url");
        const videoTitle = card.getAttribute("data-title");

        if (embedUrl) {
          openVideoModal(embedUrl, videoTitle);
        } else {
          window.open(videoUrl, "_blank");
        }
      });
    });

    // FIX FOR ANSWER VISIBILITY: Smoothly scroll to the START of the newly generated answer
    setTimeout(() => {
      asstMsg.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function showWelcome() {
    els.chatMessages.innerHTML = "";
    if (els.welcomeCard) {
      els.chatMessages.appendChild(els.welcomeCard);
    }
  }

  // ==========================================
  // Ask Question / Problem Submission
  // ==========================================
  async function submitQuestion() {
    const q = els.questionInput.value.trim();
    if (!q) return;

    // Ensure we are in tutor view
    if (state.activeMode !== "tutor") {
      switchMode("tutor");
    }

    // Visual loading state
    els.sendBtn.disabled = true;
    els.questionInput.disabled = true;
    els.sendBtn.innerHTML = `<span class="spin">⏳</span>`;

    // Append temporary user bubble
    const tempUser = document.createElement("div");
    tempUser.className = "msg-row";
    tempUser.innerHTML = `
      <div class="msg-user">
        <div class="msg-user-header">
          <span class="msg-user-title">PROBLEM QUERY</span>
          <span class="msg-user-time">Just now</span>
        </div>
        <div class="msg-user-text">${escapeHtml(q)}</div>
        ${state.attachedFile ? `<div class="msg-user-att-chip">📎 ${state.attachedFile.filename}</div>` : ''}
      </div>
    `;
    els.chatMessages.appendChild(tempUser);

    // Append loading skeleton bubble
    const tempLoading = document.createElement("div");
    tempLoading.className = "msg-row";
    tempLoading.innerHTML = `
      <div class="msg-assistant">
        <div class="msg-agent-header">
          <span class="agent-badge-name">Specialist Agent Formulating Derivation...</span>
          <span class="badge">Consulting Knowledge</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Executing mathematical steps, checking boundary conditions, and querying YouTube & Google Books...</p>
      </div>
    `;
    els.chatMessages.appendChild(tempLoading);
    tempLoading.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const payload = {
        question: q,
        domain: state.activeDomainFilter !== "all" ? state.activeDomainFilter : "auto",
        model_preference: state.modelPreference,
        file_text: state.attachedFile ? state.attachedFile.text_content : null,
        image_b64: state.attachedFile ? state.attachedFile.image_b64 : null
      };

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      tempLoading.remove();

      if (res.ok && data.success) {
        const fullRecord = {
          ...data,
          id: data.id || data.record_id,
          record_id: data.record_id || data.id
        };
        state.currentRecord = fullRecord;
        state.history.unshift(fullRecord);
        renderHistorySidebar();
        displayRecord(fullRecord.id);

        if (data.user_profile) {
          state.userProfile = data.user_profile;
          updateProfileAndProgressUI();
        }

        // Reset input and attachments
        els.questionInput.value = "";
        clearAttachment();

        // Scroll chat container so new answer is immediately visible
        if (els.chatContainer) {
          els.chatContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        showToast(data.error || "Generation error. Please retry.");
      }
    } catch (err) {
      tempLoading.remove();
      console.error(err);
      showToast("Network error. Check connection.");
    } finally {
      els.sendBtn.disabled = false;
      els.questionInput.disabled = false;
      els.sendBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      els.questionInput.focus();
    }
  }

  // ==========================================
  // Attachments & Uploads
  // ==========================================
  els.addFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    els.fileOptionsMenu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!els.addFileBtn.contains(e.target) && !els.fileOptionsMenu.contains(e.target)) {
      els.fileOptionsMenu.classList.remove("open");
    }
  });

  els.optPhoto.addEventListener("click", () => {
    els.fileOptionsMenu.classList.remove("open");
    els.photoInput.click();
  });

  els.photoInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) await handleFileUpload(file);
  });

  els.optFiles.addEventListener("click", () => {
    els.fileOptionsMenu.classList.remove("open");
    els.fileInput.click();
  });

  els.fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) await handleFileUpload(file);
  });

  async function handleFileUpload(file) {
    showToast(`Uploading and parsing ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        state.attachedFile = data;
        showAttachmentBar(data);
        showToast(`Attached: ${data.filename}`);
      } else {
        showToast("Error parsing file.");
      }
    } catch (err) {
      console.error(err);
      showToast("Upload failed.");
    }
  }

  function showAttachmentBar(data) {
    els.attachmentPreviewBar.style.display = "flex";
    els.attName.textContent = data.filename;
    els.attSize.textContent = `${Math.round(data.size_bytes / 1024)} KB`;
  }

  function clearAttachment() {
    state.attachedFile = null;
    els.attachmentPreviewBar.style.display = "none";
    els.photoInput.value = "";
    els.fileInput.value = "";
  }

  els.removeAttBtn.addEventListener("click", clearAttachment);

  // ==========================================
  // Camera Snapshot Modal
  // ==========================================
  let cameraStream = null;

  els.optCamera.addEventListener("click", async () => {
    els.fileOptionsMenu.classList.remove("open");
    els.cameraModal.classList.add("open");

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      els.cameraVideo.srcObject = cameraStream;
    } catch (err) {
      console.error(err);
      showToast("Cannot access webcam. Check permissions.");
      closeCamera();
    }
  });

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    els.cameraModal.classList.remove("open");
  }

  els.closeCameraBtn.addEventListener("click", closeCamera);

  els.snapPhotoBtn.addEventListener("click", () => {
    const video = els.cameraVideo;
    const canvas = els.cameraCanvas;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const b64 = canvas.toDataURL("image/jpeg", 0.85);
    state.attachedFile = {
      filename: `camera_snapshot_${Date.now()}.jpg`,
      file_type: "image",
      size_bytes: Math.round(b64.length * 0.75),
      image_b64: b64,
      text_content: "[Attached Camera Photo of Academic Problem]"
    };
    showAttachmentBar(state.attachedFile);
    showToast("Photo captured and attached!");
    closeCamera();
  });

  // ==========================================
  // Voice Input (Web Speech API)
  // ==========================================
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = true;

    state.recognition.onstart = () => {
      state.isRecording = true;
      els.micBtn.classList.add("recording");
      showToast("Listening... Speak your academic question now.");
    };

    state.recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      els.questionInput.value = transcript;
    };

    state.recognition.onend = () => {
      state.isRecording = false;
      els.micBtn.classList.remove("recording");
    };

    state.recognition.onerror = (e) => {
      console.error(e);
      state.isRecording = false;
      els.micBtn.classList.remove("recording");
    };

    els.micBtn.addEventListener("click", () => {
      if (state.isRecording) {
        state.recognition.stop();
      } else {
        state.recognition.start();
      }
    });
  } else {
    els.micBtn.addEventListener("click", () => {
      showToast("Speech recognition is not supported on this browser.");
    });
  }

  // ==========================================
  // Text to Speech
  // ==========================================
  function speakText(rawText) {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech not supported.");
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = rawText
      .replace(/\$\$(.*?)\$\$/g, "formula")
      .replace(/\$(.*?)\$/g, "formula")
      .replace(/```[\s\S]*?```/g, "code block")
      .replace(/#/g, "")
      .replace(/\*/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 1000));
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    showToast("Reading derivation aloud...");
  }

  // ==========================================
  // Video Modal
  // ==========================================
  function openVideoModal(embedUrl, title) {
    els.videoModalTitle.textContent = title;
    els.videoIframe.src = embedUrl;
    els.videoModal.classList.add("open");
  }

  els.closeVideoBtn.addEventListener("click", () => {
    els.videoIframe.src = "";
    els.videoModal.classList.remove("open");
  });

  // ==========================================
  // Examination / Quiz Generator (In Learn Mode)
  // ==========================================
  els.generateQuizBtn.addEventListener("click", async () => {
    const currentTopic = state.currentRecord ? state.currentRecord.question : "Quantum Mechanics and Dynamic Programming";
    showToast("Generating academic examination quiz...");
    els.generateQuizBtn.disabled = true;

    try {
      const res = await fetch("/api/tutor/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentTopic,
          domain: state.currentRecord ? state.currentRecord.domain : "general"
        })
      });

      if (res.ok) {
        const data = await res.json();
        renderQuiz(data.quiz);
      }
    } catch (e) {
      console.error(e);
      showToast("Error generating quiz.");
    } finally {
      els.generateQuizBtn.disabled = false;
    }
  });

  function renderQuiz(quizItems) {
    if (!quizItems || !quizItems.length) return;
    els.quizContainer.style.display = "flex";
    els.quizContainer.innerHTML = quizItems.map((qItem, qIdx) => `
      <div class="quiz-item" data-correct="${qItem.correct_index}">
        <div class="quiz-q">${qIdx + 1}. ${escapeHtml(qItem.question)}</div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${qItem.options.map((opt, optIdx) => `
            <div class="quiz-opt" data-opt-idx="${optIdx}">
              <strong style="color: var(--forest-green);">${String.fromCharCode(65 + optIdx)})</strong>
              <span>${escapeHtml(opt)}</span>
            </div>
          `).join("")}
        </div>
        <div class="quiz-explanation" style="display: none;">
          <strong>Pedagogical Explanation:</strong> ${escapeHtml(qItem.explanation)}
        </div>
      </div>
    `).join("");

    renderRichContent(els.quizContainer);

    els.quizContainer.querySelectorAll(".quiz-item").forEach(item => {
      const correctIdx = parseInt(item.getAttribute("data-correct"), 10);
      const expl = item.querySelector(".quiz-explanation");

      item.querySelectorAll(".quiz-opt").forEach(optDiv => {
        optDiv.addEventListener("click", () => {
          const chosen = parseInt(optDiv.getAttribute("data-opt-idx"), 10);
          item.querySelectorAll(".quiz-opt").forEach(o => o.classList.remove("correct", "incorrect"));

          if (chosen === correctIdx) {
            optDiv.classList.add("correct");
            showToast("Correct derivation!");
          } else {
            optDiv.classList.add("incorrect");
            const correctOpt = item.querySelector(`[data-opt-idx="${correctIdx}"]`);
            if (correctOpt) correctOpt.classList.add("correct");
            showToast("Incorrect. Study the explanation.");
          }
          expl.style.display = "block";
        });
      });
    });
  }

  // ==========================================
  // Flashcards (In Learn Mode)
  // ==========================================
  els.flashcardElement.addEventListener("click", () => {
    els.flashcardElement.classList.toggle("flipped");
  });

  function updateFlashcardView() {
    const fc = state.flashcards[state.currentFlashcardIndex];
    els.flashcardCounter.textContent = `Card ${state.currentFlashcardIndex + 1} / ${state.flashcards.length}`;
    els.fcDomainBadge.textContent = fc.domain;
    els.flashcardQuestion.textContent = fc.q;
    els.flashcardAnswer.innerHTML = fc.a;
    els.flashcardElement.classList.remove("flipped");
    renderRichContent(els.flashcardAnswer);
  }

  els.prevFlashcardBtn.addEventListener("click", () => {
    state.currentFlashcardIndex = (state.currentFlashcardIndex - 1 + state.flashcards.length) % state.flashcards.length;
    updateFlashcardView();
  });

  els.nextFlashcardBtn.addEventListener("click", () => {
    state.currentFlashcardIndex = (state.currentFlashcardIndex + 1) % state.flashcards.length;
    updateFlashcardView();
  });

  // ==========================================
  // Profile Save
  // ==========================================
  els.saveProfileBtn.addEventListener("click", async () => {
    const newName = els.profileNameInput.value.trim();
    const newLevel = els.knowledgeLevelSelect.value;
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: newName, knowledge_level: newLevel })
      });
      if (res.ok) {
        showToast("Profile classification updated!");
        await loadProfile();
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Language Switchers
  if (els.langSelect) {
    els.langSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
      showToast(`Language set to: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }
  if (els.settingLangSelect) {
    els.settingLangSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
      showToast(`Language set to: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // Black & White Mode Toggles
  if (els.bwToggleBtn) {
    els.bwToggleBtn.addEventListener("click", () => {
      toggleBwMode();
      showToast(state.bwMode ? "Monochrome High-Contrast mode active" : "Monochrome mode disabled");
    });
  }
  if (els.settingBwToggleBtn) {
    els.settingBwToggleBtn.addEventListener("click", () => {
      toggleBwMode();
      showToast(state.bwMode ? "Monochrome High-Contrast mode active" : "Monochrome mode disabled");
    });
  }

  // Recommendation Studio Subtabs
  if (els.recSubtabs) {
    els.recSubtabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const subtab = tab.getAttribute("data-subtab");
        els.recSubtabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        els.recSubviews.forEach(v => v.classList.remove("active"));
        const targetView = document.getElementById(`subview${subtab.charAt(0).toUpperCase() + subtab.slice(1)}`);
        if (targetView) targetView.classList.add("active");

        if (subtab === "videos") loadCategorizedVideos();
        else if (subtab === "ncert") filterNcertBooks();
        else if (subtab === "papers") searchResearchPapers();
        else if (subtab === "books") searchAcademicBooks();
      });
    });
  }

  // NCERT Filter & Search
  if (els.ncertFilterBtn) els.ncertFilterBtn.addEventListener("click", filterNcertBooks);
  if (els.ncertClassSelect) els.ncertClassSelect.addEventListener("change", filterNcertBooks);
  if (els.ncertSubjectSelect) els.ncertSubjectSelect.addEventListener("change", filterNcertBooks);
  if (els.ncertMediumSelect) els.ncertMediumSelect.addEventListener("change", filterNcertBooks);
  if (els.ncertSearchInput) {
    els.ncertSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") filterNcertBooks();
    });
  }

  // Research Papers Search
  if (els.papersSearchBtn) els.papersSearchBtn.addEventListener("click", () => searchResearchPapers());
  if (els.papersSearchInput) {
    els.papersSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchResearchPapers();
    });
  }

  // Academic Books Search
  if (els.booksSearchBtn) els.booksSearchBtn.addEventListener("click", () => searchAcademicBooks());
  if (els.booksDomainSelect) els.booksDomainSelect.addEventListener("change", () => searchAcademicBooks());
  if (els.booksSearchInput) {
    els.booksSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchAcademicBooks();
    });
  }

  // Domain Filter Chips
  els.domainFilterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      els.domainFilterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.activeDomainFilter = chip.getAttribute("data-domain");
      loadHistory();
    });
  });

  // Search Input
  els.chatSearchInput.addEventListener("input", () => loadHistory());

  // New Chat Button
  els.newChatBtn.addEventListener("click", () => {
    state.currentRecord = null;
    renderHistorySidebar();
    showWelcome();
    els.questionInput.value = "";
    els.questionInput.focus();
  });

  // Clear History
  els.clearAllBtn.addEventListener("click", async () => {
    if (confirm("Clear all session history from local JSON storage?")) {
      await fetch("/api/history/clear", { method: "POST" });
      state.history = [];
      state.currentRecord = null;
      showWelcome();
      renderHistorySidebar();
      showToast("History cleared.");
    }
  });

  if (els.clearHistoryBtn) {
    els.clearHistoryBtn.addEventListener("click", async () => {
      if (confirm("Clear all session history from local JSON storage?")) {
        await fetch("/api/history/clear", { method: "POST" });
        state.history = [];
        state.currentRecord = null;
        showWelcome();
        renderHistorySidebar();
        showToast("History cleared.");
      }
    });
  }

  // Quick Action Buttons
  document.querySelectorAll(".quick-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      els.questionInput.value = btn.getAttribute("data-q");
      submitQuestion();
    });
  });

  // Send Button & Enter Key
  els.sendBtn.addEventListener("click", submitQuestion);

  els.questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuestion();
    }
  });

  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial Boot
  if (state.bwMode) toggleBwMode(true);
  applyLanguage(state.language);
  loadHistory();
  loadProfile();
  updateFlashcardView();
});
