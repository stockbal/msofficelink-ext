import { OfficeFileEnding } from './OfficeFileEnding';

export class LinkUtil {
  /**
   * Returns information about the link
   * @param link
   */
  static getLinkInfo(link) {
    let cleanedLink = null;
    // check if link is wopi frame link
    if (LinkUtil.isWopiFrameLink(link)) {
      // extract source link from wopi frame link
      cleanedLink = LinkUtil._extractWopiFrameSourceLink(link);
    } else {
      cleanedLink = LinkUtil._removeQueryParams(link);
    }
    if (OfficeFileEnding.isWordFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-word', type: 'word' };
    } else if (OfficeFileEnding.isExcelFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-excel', type: 'excel' };
    } else if (OfficeFileEnding.isPowerPointFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-powerpoint', type: 'powerpoint' };
    } else if (OfficeFileEnding.isVisioFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-visio', type: 'visio' };
    } else {
      return { link: cleanedLink, protocol: '', type: '' };
    }
  }

  /**
   * Checks if the given link is relevant for the extension
   * @param link
   */
  static isLinkRelevant(link) {
    // exclude file protocol links -> they are not working with the office URI protocols
    if (link.startsWith('file://')) {
      return false;
    }

    if (LinkUtil.isWopiFrameLink(link)) {
      // check if the file ending is relevant
      let linkInfo = LinkUtil.getLinkInfo(link);
      return linkInfo.type !== '';
    }
    // only consider segment after last slash
    const lastSlashSegment = link.substr(link.lastIndexOf('/'), link.length);
    if (!lastSlashSegment || lastSlashSegment === '') {
      return false;
    }

    // test if it as a link which points to a file
    const regexResult = lastSlashSegment.match(/(.*\.[a-zA-Z]{3,4})($|\?|#)+/);
    if (regexResult === null || regexResult.length < 2) {
      return false;
    }
    // test if the link points to an ms office document
    return new RegExp(
      `\\.(${OfficeFileEnding.getAllFileEndings().join('|')})(^\\.|([\\?#&].*)|$)`
    ).test(lastSlashSegment);
  }

  /**
   * Removes all url query parameters from the given link
   * @param link
   * @private
   */
  static _removeQueryParams(link) {
    const regexResult = link.match(/(.*\.[a-zA-Z]{3,4})($|\?|#)+/);
    if (regexResult !== null && regexResult.length > 1) {
      let matchWithLink = regexResult[1];
      if (/[\\?#&]+/.test(matchWithLink)) {
        throw Error('Link does not match');
      } else {
        return matchWithLink;
      }
    } else {
      throw Error('Link does not match');
    }
  }

  /**
   * Checks if the given link is a WOPI Frame link
   * @param link {String} the link to be checked
   * @return {boolean}
   */
  static isWopiFrameLink(link) {
    return link.includes('WopiFrame.aspx?sourcedoc');
  }

  /**
   * Extracts source document link from WOPI frame link
   * @param link {String}
   * @return {String} the extracted WOPI Frame link
   * @private
   */
  static _extractWopiFrameSourceLink(link) {
    const tokens = link.split('/');
    const origin = `${tokens[0]}/${tokens[2]}`;
    const sourcedoc = link.match(/sourcedoc=(.*\.[a-zA-Z]+)/)[1];
    return LinkUtil._removeQueryParams(`${origin}${sourcedoc}`);
  }
}
