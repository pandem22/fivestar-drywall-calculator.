const translations = {
  el: {
    title: "Υπολογιστής Υλικών Γυψοσανίδας",
    labelClientName: "Όνομα Πελάτη:",
    saveClientButton: "Αποθήκευση Πελάτη",
    labelAddRoom: "Προσθήκη Τοίχου / Χώρου",
    labelRoomName: "Όνομα Χώρου:",
    labelConstructionType: "Τύπος Κατασκευής:",
    labelHeight: "Ύψος (m):",
    labelLength: "Μήκος (m):",
    labelDoors: "Πόρτες (m²):",
    labelWindows: "Παράθυρα (m²):",
    addRoomButton: "Προσθήκη Χώρου",
    labelMaterialSettings: "Ρυθμίσεις Υλικών",
    labelBoardLength: "Μήκος Φύλλων / Προφίλ:",
    labelStudSpacing: "Απόσταση Ορθοστατών:",
    labelStructureType: "Τύπος Σκελετού:",
    labelPrices: "Τιμές Υλικών (€)",
    labelWaste: "Φύρα (%)",
    labelEconomics: "Οικονομικά",
    calculateButton: "Υπολογισμός"
  },
  en: {
    title: "Drywall Materials Calculator",
    labelClientName: "Client Name:",
    saveClientButton: "Save Client",
    labelAddRoom: "Add Wall / Room",
    labelRoomName: "Room Name:",
    labelConstructionType: "Construction Type:",
    labelHeight: "Height (m):",
    labelLength: "Length (m):",
    labelDoors: "Doors (m²):",
    labelWindows: "Windows (m²):",
    addRoomButton: "Add Room",
    labelMaterialSettings: "Material Settings",
    labelBoardLength: "Board / Profile Length:",
    labelStudSpacing: "Stud Spacing:",
    labelStructureType: "Structure Type:",
    labelPrices: "Material Prices (€)",
    labelWaste: "Waste (%)",
    labelEconomics: "Economics",
    calculateButton: "Calculate"
  }
};

function changeLanguage(lang) {
  const elements = Object.keys(translations[lang]);
  elements.forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.tagName === "INPUT" || el.tagName === "BUTTON" || el.tagName === "SELECT") {
        el.value = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });
}