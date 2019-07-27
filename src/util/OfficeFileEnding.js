const wordFileEndings = ['doc', 'docx', 'docm'];
const excelFileEndings = ['xls', 'xlsx', 'xlsm', 'csv', 'xlsb'];
const powerPointFileEndings = ['ppt', 'pptx', 'pptm'];
const visioFileEndings = ['vsd', 'vsdx', 'vsdm', 'vssx', 'vssm', 'vstx', 'vstm'];
/**
 * Utility class for checking office link file endings
 */
export class OfficeFileEnding {
  /**
   * Checks if the link points to an Excel file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Excel file
   */
  static isExcelFileEnding(link) {
    return new RegExp(`\\.(${excelFileEndings.join('|')})$`).test(link);
  }

  /**
   * Checks if the link points to an PowerPoint file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is PowerPoint file
   */
  static isPowerPointFileEnding(link) {
    return new RegExp(`\\.(${powerPointFileEndings.join('|')})$`).test(link);
  }

  /**
   * Checks if the link points to an Word file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Word file
   */
  static isWordFileEnding(link) {
    return new RegExp(`\\.(${wordFileEndings.join('|')})$`).test(link);
  }

  /**
   * Checks if the link points to a Visio file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Visio file
   */
  static isVisioFileEnding(link) {
    return new RegExp(`\\.(${visioFileEndings.join('|')})$`).test(link);
  }

  static getAllEndingsAsRegex() {
    return new RegExp(
      `\\.(${excelFileEndings
        .concat(wordFileEndings, powerPointFileEndings, visioFileEndings)
        .join('|')})`
    );
  }

  /**
   * Returns all valid Office file endings that the extension can handle
   * @returns {string[]}
   */
  static getAllFileEndings() {
    return excelFileEndings.concat(wordFileEndings, powerPointFileEndings, visioFileEndings);
  }
}
