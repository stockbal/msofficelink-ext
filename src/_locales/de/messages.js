/**
 * @see {@link https://developer.chrome.com/extensions/i18n}
 */
module.exports = {
  extName: {
    message: 'MS Doc Link'
  },
  extDescription: {
    message: 'Öffnet / Verwaltet Hyperlinks auf MS Office Dokumente'
  },
  // messages for link open options
  LinkOption_openOnline: { message: 'Online öffnen' },
  LinkOption_openProtected: { message: 'Schreibgeschützt öffnen' },
  LinkOption_openEdit: { message: 'In Bearbeitungsmodus öffnen' },
  LinkOption_download: { message: 'Datei herunterladen' },
  LinkOption_original: { message: 'Original' },
  LinkOption_popover: { message: 'Optionsmenü anzeigen' },
  LinkOption_addToFavs: { message: 'Zu Favoriten hinzufügen' },
  LinkOption_openParent: { message: 'Webseiten-Ordner öffnen' },
  LinkOption_openOwnerPage: { message: 'Seite des Links anzeigen' },
  // messages for Extension settings
  Setting_newTab: { message: 'In neuem Tab öffnen' },
  Setting_popupDefaultTab: { message: 'Standard Menu' },
  Setting_defaultMenuLinkAction: { message: 'Link Aktion in Erweiterung' },
  Setting_defaultLinkAction: { message: 'Link Aktion' },
  Setting_activateHistory: { message: 'Verlauf aktivieren' },
  Setting_maxHistoryCount: { message: 'Maximale Anzahl Links in Historie' },

  OptionTab_favs: { message: 'Favoriten' },
  OptionTab_history: { message: 'Verlauf' },
  OptionTab_options: { message: 'Einstellungen' },

  // Button texts
  Btn_clearHistory: { message: 'Verlauf löschen' },
  Btn_clearFavs: { message: 'Alle Favoriten löschen' },
  Btn_showHistory: { message: 'Vollständigen Verlauf anzeigen' },
  Btn_showAllFavs: { message: 'Alle Favoriten anzeigen' },

  // All kinds of messages
  MSG_noHistory: { message: 'Kein Verlauf vorhanden' },
  MSG_noFavorites: { message: 'Keine Favoriten vorhanden' },
  MSG_favsWereDeleted: { message: 'Favoriten wurden gelöscht' },
  MSG_historyWasDeleted: { message: 'Verlauf wurde gelöscht' },
  MSG_linkOptionSwitchedToOriginal: {
    message:
      'Um die Standard-Aktion der MS Office Links wiederherzustellen ist eine Seiten-Aktualisierung nötig'
  },
  MSG_historyEmptyInfoText: {
    message: 'Hier wird der Verlauf für ihre MS Office Dokumente angezeigt'
  },
  MSG_favsEmptyInfoText: {
    message: 'Hier werden die Favoriten für ihre MS Office Dokumente angezeigt'
  },

  MSG_favAddedInfo: {
    message: `Datei '$fav$' wurde zu den Favoriten hinzugefügt`,
    placeholders: {
      fav: {
        content: '$1'
      }
    }
  },
  // tooltip texts
  Tip_searchCleas: { message: 'Suche löschen' },

  // Texts for single document link
  Link_addFavorite: { message: 'Zu Favoriten hinzufügen' },
  Link_deleteFavorite: { message: 'Favorit löschen' },

  // Texts for history / favorites page
  History_title: { message: 'MS Office Dokumente' },
  History_pageTitle: { message: 'Favoriten & Verlauf ' },
  History_ctxMenuOpen: { message: 'Favoriten && Verlauf' },
  History_search: { message: 'Suchen' },
  History_showFavs: { message: 'Favoriten' },
  History_showHistoryLinks: { message: 'Historieneinträge' }
};
