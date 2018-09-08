/**
 * @see {@link https://developer.chrome.com/extensions/i18n}
 */
module.exports = {
  extName: {
    message: 'MS Doc Link'
  },
  extDescription: {
    message: 'Handle MS Office Document links in a better way'
  },
  // messages for link open options
  LinkOption_openOnline: { message: 'Open online' },
  LinkOption_openProtected: { message: 'Open in protected mode' },
  LinkOption_openEdit: { message: 'Open in edit mode' },
  LinkOption_download: { message: 'Download file' },
  LinkOption_original: { message: 'Original' },
  LinkOption_popover: { message: 'Show option popover' },
  LinkOption_addToFavs: { message: 'Add to favorites' },
  LinkOption_openParent: { message: 'Open Parent folder' },
  LinkOption_openOwnerPage: { message: 'Open owning Website' },
  // messages for Extension settings
  Setting_newTab: { message: 'Open in new Tab' },
  Setting_popupDefaultTab: { message: 'Default Visible Menu' },
  Setting_defaultMenuLinkAction: { message: 'Link Action in Extension' },
  Setting_defaultLinkAction: { message: 'Link Action' },
  Setting_activateHistory: { message: 'Activate Link History' },
  Setting_maxHistoryCount: { message: 'Maximum Link History' },

  OptionTab_favs: { message: 'Favorites' },
  OptionTab_history: { message: 'History' },
  OptionTab_options: { message: 'Settings' },

  // Button texts
  Btn_clearHistory: { message: 'Clear History' },
  Btn_clearFavs: { message: 'Delete all favorites' },
  Btn_showHistory: { message: 'Show full history' },
  Btn_showAllFavs: { message: 'Show all favorites' },

  // All kinds of messages
  MSG_noHistory: { message: 'No History entries yet' },
  MSG_noFavorites: { message: 'No Favorites yet' },
  MSG_favsWereDeleted: { message: 'Favorites have been deleted' },
  MSG_historyWasDeleted: { message: 'History links have been deleted' },
  MSG_linkOptionSwitchedToOriginal: {
    message: 'To get the original link action back you have to do a page refresh'
  },
  MSG_historyEmptyInfoText: {
    message: 'Here you see the history for your MS Office Documents'
  },
  MSG_favsEmptyInfoText: {
    message: 'Here you see the favorites for your MS Office Documents'
  },

  MSG_favAddedInfo: {
    message: `File '$fav$' was added to the favorites`,
    placeholders: {
      fav: {
        content: '$1'
      }
    }
  },
  // tooltip texts
  Tip_searchCleas: { message: 'Clear search' },

  // Texts for single document link
  Link_addFavorite: { message: 'Mark as favorite' },
  Link_deleteFavorite: { message: 'Delete favorite' },

  // Texts for history / favorites page
  History_title: { message: 'MS Office Documents' },
  History_pageTitle: { message: 'Favorites & History ' },
  History_ctxMenuOpen: { message: 'Favorites and History' },
  History_search: { message: 'Search' },
  History_showFavs: { message: 'Favorites' },
  History_showHistoryLinks: { message: 'History entries' }
};
