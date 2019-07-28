/**
 * Valid filter types
 */
const FilterType = {
  /**
   * Type was not recognized
   */
  INVALID: 'invalid',
  /**
   * Simple host name filter
   * e.g.: org.example.com, www.amazon.com
   * - must not contain any '/'
   */
  PLAIN_HOST_NAME: 'plain',
  /**
   * Specific page filter
   * e.g.: https://www.amazon.com
   */
  SINGLE_PAGE: 'single-page',
  /**
   * Simple patterns
   * e.g. *reddit.com/r/privacy/*
   */
  SIMPLE_PATTERN: 'pattern',
  /**
   * Regular Expression pattern as the most complex option
   * (the filter MUST start and end with '/' to be recognized as RegEx)
   * e.g.:
   * - /^https?://192\.168\.0\.\d+//
   * - /^https://[0-9a-z-]+//
   */
  REGEX: 'regex'
};

/**
 * Utility class to check whitelist/blacklist filters against current webpage
 */
export class FilterListUtil {
  /**
   * If the location is not found in the url filter list than this function will return <code>true</code>
   * @param location {Location} the location of the current page
   * @param filters {String} a list of url filters
   * @returns {boolean}
   */
  static checkAgainstWhiteList(location, filters) {
    return FilterListUtil._found(location, filters);
  }

  /**
   * If the location is not found in the url filter list than this function will return <code>true</code>
   * @param location {Location} the location of the current page
   * @param filters {String} a list of url filters
   * @returns {boolean}
   */
  static checkAgainstBlackList(location, filters) {
    return !FilterListUtil._found(location, filters);
  }

  /**
   * If the location is found in the filters String <code>true</code> will be returned
   * @param location {Location} the location to be checked
   * @param filters {String} a String of filters
   * @returns {boolean}
   * @private
   */
  static _found(location, filters) {
    const filterList = FilterListUtil._extractFilterList(filters);
    if (!filterList) {
      return false;
    }
    for (let i = 0; i < filterList.length; i++) {
      if (FilterListUtil._matches(filterList[i], location)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Extracts a list of valid filters from a String
   * @param filters {String} a String of filters
   * @returns {null|Array}
   * @private
   */
  static _extractFilterList(filters) {
    if (!filters || filters === '') {
      return null;
    }
    let temp = filters.split('\n');
    let filterList = [];
    temp.forEach(filter => {
      filter = filter.trim().toLowerCase();
      if (filter === '') {
        return;
      }
      if (filter.startsWith('#')) {
        return;
      }
      const type = FilterListUtil._categorizeFilter(filter);
      if (type !== FilterType.INVALID) {
        filterList.push({ filter, type });
      }
    });
    return filterList;
  }

  /**
   * Checks the given filter against the given location
   * @param filter {Object} the filter object
   * @param location {Location}
   * @returns {boolean}
   * @private
   */
  static _matches(filter, location) {
    switch (filter.type) {
      case FilterType.PLAIN_HOST_NAME:
        return location.hostname.toLowerCase().endsWith(filter.filter);
      case FilterType.SIMPLE_PATTERN:
        const escapeRegex = str => str.replace(/([.*+?^=!:${}()|\\[\]\\/\\])/g, '\\$1');
        return new RegExp(
          '^' +
            filter.filter
              .split('*')
              .map(escapeRegex)
              .join('.*') +
            '$'
        ).test(location.hostname);
      case FilterType.SINGLE_PAGE:
        return location.href.toLowerCase() === filter.filter;
      case FilterType.REGEX:
        // removed leading and trailing '/'
        filter.filter = filter.filter.substr(1, filter.filter.length - 2);
        try {
          console.log(filter.filter, location.href.toLowerCase());
          return new RegExp(filter.filter).test(location.href.toLowerCase());
        } catch (e) {
          console.log(e);
          return false;
        }
    }
    return false;
  }

  /**
   * Returns the FilterType of the given filter string
   * @param filter {String} the filter string to be checked
   * @returns {FilterType} the determined filter type
   * @private
   */
  static _categorizeFilter(filter) {
    if (filter.startsWith('/') && filter.endsWith('/')) {
      return FilterType.REGEX;
    } else if (filter.includes('/')) {
      if (filter.includes('*')) {
        return FilterType.SIMPLE_PATTERN;
      } else {
        return FilterType.SINGLE_PAGE;
      }
    } else {
      return FilterType.PLAIN_HOST_NAME;
    }
  }
}
