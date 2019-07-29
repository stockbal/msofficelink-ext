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
  extOptions: { message: 'Options' },
  // messages for context menus
  CTX_copyLinkAddressAs: { message: 'Copy address of the document as...' },
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
  LinkOption_copyDocLink: { message: 'Copy address of the document' },
  // messages for Extension settings
  Setting_newTab: { message: 'Open in new Tab' },
  Setting_popupDefaultTab: { message: 'Default Tab in Popup' },
  Setting_defaultMenuLinkAction: { message: 'Link Action in Popup' },
  Setting_defaultLinkAction: { message: 'Link Action' },
  Setting_activateHistory: { message: 'Activate Link History' },
  Setting_maxHistoryCount: { message: 'Maximum Link History' },
  Setting_copyLinkMode: { message: `Copy document address` },

  OptionTab_favs: { message: 'Favorites' },
  OptionTab_history: { message: 'History' },
  OptionTab_options: { message: 'Settings' },
  OptionTab_whiteBlackList: { message: 'White-/Blacklist' },

  // Button texts
  Btn_clearHistory: { message: 'Clear History' },
  Btn_clearFavs: { message: 'Delete all favorites' },
  Btn_showHistory: { message: 'Show full history' },
  Btn_showAllFavs: { message: 'Show all favorites' },

  // All kinds of messages
  MSG_urlFilterListInfo: {
    message:
      '$type$ Rules control on which Web Pages MS Doc Link should$not$ be active (Context Menu will always be active).' +
      '<ul class="list"><li>One Entry per Line</li><li>Invalid Rules are ignored silently</li></ul>',
    placeholders: {
      type: {
        content: '$1'
      },
      not: {
        content: '$2'
      }
    }
  },
  MSG_filterListManualIntro: { message: 'The following filter rules exist' },
  MSG_domainFilterDescription: {
    message:
      '<strong>Domain Filter</strong> Rules are simple Filters that only work on the ' +
      'Domain Part of a URL. The must not contain any <code>*</code>' +
      ' or <code>/</code> Characters'
  },
  MSG_singlePageFilterDescription: {
    message:
      'If <strong>specific Pages</strong> should be filtered, the whole ' +
      'URL will be compared with the Filter'
  },
  MSG_simplePatternFilterDescription: {
    message:
      'If only specific Parts of a Web Page should be filtered, you can use ' +
      '<strong>simple Patterns</strong>'
  },
  MSG_complexRegExFilterDescription: {
    message:
      'If none of the previously described Filter Methods work, you can create complex ' +
      'Rules by using <strong>regular Expressions</strong>. To be recognized as such they ' +
      'have to start and end with <code>/</code>.'
  },
  MSG_whiteList: { message: 'Whitelist' },
  MSG_blackList: { message: 'Blacklist' },
  MSG_not: { message: 'not' },
  MSG_filterListTypeLabel: { message: 'Type' },
  MSG_filterListInfoHeader: { message: 'What is a' },
  MSG_filterPatternHelpHeader: { message: 'How do I write a Filter Rule?' },
  MSG_noHistory: { message: 'No History entries yet' },
  MSG_noFavorites: { message: 'No Favorites yet' },
  MSG_favsWereDeleted: { message: 'Favorites have been deleted' },
  MSG_historyWasDeleted: { message: 'History links have been deleted' },
  MSG_deleteAllFavsWarning: { message: 'Do you really want to delete all favorites?' },
  MSG_deleteHistoryWarning: { message: 'Do you really want to delete the complete history?' },
  MSG_deactivateHistoryWarning: {
    message:
      'By deactivating the history all existing ' +
      'entries in the history will be deleted. ' +
      'Are you sure you want to continue?'
  },
  MSG_linkOptionSwitchedToOriginal: {
    message: 'To get the original link action back you have to do a page refresh'
  },
  MSG_historyEmptyInfoText: {
    message: 'Here you see the history for your MS Office Documents'
  },
  MSG_favsEmptyInfoText: {
    message: 'Here you see the favorites for your MS Office Documents'
  },
  MSG_searchResultText: {
    message: 'Found $count$ result$plural$ in $type$ for "$searchText$"',
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
    message: `File '$fav$' was added to the favorites`,
    placeholders: {
      fav: {
        content: '$1'
      }
    }
  },
  MSG_linkCopiedInfo: { message: `Address of the document was copied to the clipboard` },
  // tooltip texts
  Tip_searchClass: { message: 'Clear search' },

  // Some general texts
  Cancel: { message: 'Cancel' },
  Delete: { message: 'Delete' },
  Ok: { message: 'Ok' },
  Yes: { message: 'Yes' },
  No: { message: 'No' },
  Warning: { message: 'Warning' },
  ResultPluralSuffix: { message: 's' },
  Examples: { message: 'Examples' },

  // Texts for single document link
  Link_addFavorite: { message: 'Mark as favorite' },
  Link_deleteFavorite: { message: 'Delete favorite' },

  // Texts for history / favorites page
  History_title: { message: 'MS Office Documents' },
  History_pageTitle: { message: 'Favorites & History ' },
  History_ctxMenuOpen: { message: 'Favorites && History' },
  History_search: { message: 'Search Favorites/History' },
  History_showFavs: { message: 'Favorites' },
  History_showHistoryLinks: { message: 'History entries' },
  History_entriesSelected: {
    message: '$count$ selected',
    placeholders: {
      count: {
        content: '$1'
      }
    }
  }
};
