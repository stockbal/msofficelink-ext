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
  // messages for context menus
  CTX_copyLinkAddressAs: { message: 'Adresse des Dokuments kopieren als...' },
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
  LinkOption_copyDocLink: { message: 'Adresse des Dokuments kopieren' },
  // messages for Extension settings
  Setting_newTab: { message: 'In neuem Tab öffnen' },
  Setting_popupDefaultTab: { message: 'Standard Tab in Popup' },
  Setting_defaultMenuLinkAction: { message: 'Link Aktion in Popup' },
  Setting_defaultLinkAction: { message: 'Link Aktion' },
  Setting_activateHistory: { message: 'Verlauf aktivieren' },
  Setting_maxHistoryCount: { message: 'Maximale Anzahl Links in Historie' },
  Setting_copyLinkMode: { message: `Adresse des Dokuments kopieren` },

  OptionTab_favs: { message: 'Favoriten' },
  OptionTab_history: { message: 'Verlauf' },
  OptionTab_options: { message: 'Einstellungen' },
  OptionTab_whiteBlackList: { message: 'White-/Blacklist' },

  // Button texts
  Btn_clearHistory: { message: 'Verlauf löschen' },
  Btn_clearFavs: { message: 'Alle Favoriten löschen' },
  Btn_showHistory: { message: 'Vollständigen Verlauf anzeigen' },
  Btn_showAllFavs: { message: 'Alle Favoriten anzeigen' },

  // All kinds of messages
  MSG_urlFilterListInfo: {
    message:
      '$type$-Regeln schreiben vor, auf welchen Webseiten MS Doc Link$not$ aktiv sein soll (Kontextmenü ist immer aktiv).' +
      '<ul class="list"><li>Ein Eintrag pro Zeile</li><li>Ungültige Regeln werden stillschweigend ignoriert</li></ul>',
    placeholders: {
      type: {
        content: '$1'
      },
      not: {
        content: '$2'
      }
    }
  },
  MSG_whiteList: { message: 'Whitelist' },
  MSG_blackList: { message: 'Blacklist' },
  MSG_not: { message: 'nicht' },
  MSG_filterListTypeLabel: { message: 'Typ' },
  MSG_noHistory: { message: 'Kein Verlauf vorhanden' },
  MSG_noFavorites: { message: 'Keine Favoriten vorhanden' },
  MSG_favsWereDeleted: { message: 'Favoriten wurden gelöscht' },
  MSG_historyWasDeleted: { message: 'Verlauf wurde gelöscht' },
  MSG_deleteAllFavsWarning: { message: 'Wollen Sie wirklich alle Favoriten löschen?' },
  MSG_deleteHistoryWarning: { message: 'Wollen Sie den Verlauf wirklich vollständig löschen?' },
  MSG_deactivateHistoryWarning: {
    message:
      'Durch das Ausschalten der Verlaufsfunktion ' +
      'wird der gesamte Verlauf gelöscht. ' +
      'Sind Sie sicher, dass Sie fortfahren möchten?'
  },
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
  MSG_searchResultText: {
    message: '$count$ Ergebnis$plural$ in $type$ für "$searchText$" gefunden',
    placeholders: {
      count: {
        content: '$1'
      },
      plural: {
        content: '$2'
      },
      type: {
        content: '$3'
      },
      searchText: {
        content: '$4'
      }
    }
  },

  MSG_favAddedInfo: {
    message: `Datei '$fav$' wurde zu den Favoriten hinzugefügt`,
    placeholders: {
      fav: {
        content: '$1'
      }
    }
  },
  MSG_linkCopiedInfo: { message: `Adresse des Dokuments wurde in die Zwischenablage kopiert` },
  // tooltip texts
  Tip_searchClass: { message: 'Suche löschen' },

  // Some general texts
  Cancel: { message: 'Abbrechen' },
  Delete: { message: 'Löschen' },
  Ok: { message: 'Ok' },
  Yes: { message: 'Ja' },
  No: { message: 'Nein' },
  Warning: { message: 'Warnung' },
  ResultPluralSuffix: { message: 'se' },

  // Texts for single document link
  Link_addFavorite: { message: 'Zu Favoriten hinzufügen' },
  Link_deleteFavorite: { message: 'Favorit löschen' },

  // Texts for history / favorites page
  History_title: { message: 'MS Office Dokumente' },
  History_pageTitle: { message: 'Favoriten & Verlauf ' },
  History_ctxMenuOpen: { message: 'Favoriten && Verlauf' },
  History_search: { message: 'Favoriten/Verlauf durchsuchen' },
  History_showFavs: { message: 'Favoriten' },
  History_showHistoryLinks: { message: 'Historieneinträge' },
  History_entriesSelected: {
    message: '$count$ ausgewählt',
    placeholders: {
      count: {
        content: '$1'
      }
    }
  }
};
