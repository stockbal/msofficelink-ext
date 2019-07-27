/**
 * Module with some utility functions
 */

/**
 * Function to add event handler
 * @param element {HTMLElement} the element on which the handler should be registered
 * @param event {String} the name of the event
 * @param handler {Function} the event handler function
 */
export function on(element, event, handler) {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, false)
      : element.attachEvent('on' + event, handler);
  }
}

/**
 * Function to remove event handler from the given element
 * @param element {HTMLElement} the element on which the handler should be registered
 * @param event {String} the name of the event
 * @param handler {Function} the event handler function
 */
export function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent('on' + event, handler);
  }
}

export const runsSharepoint = () => {
  for (const script of document.querySelectorAll('script')) {
    if (/_layouts\/15\/sp\.init\.js/.test(script.src)) {
      return true;
    }
  }
  return false;
};

/**
 * Updates the tab url with the given url with an option to
 * create a new tab with the given url
 * @param openNewTab
 * @param url
 */
export const openUrlInTab = (openNewTab, url) => {
  if (openNewTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.create({ url: url, index: tabs[0].index + 1 });
    });
  } else {
    chrome.tabs.update({ url: url });
  }
};
