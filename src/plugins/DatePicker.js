// Possible attributes :
// - top : vertical offset from the input field (default: 4px)
// - left : horizontal offset from the input field (default: 0px)
// - lang : ISO language for the month display (default: browser language)
// - format : date format, any of DMY|MDY|YMD (default: DMY = DD/MM/YYYY)

class DatePicker extends HTMLElement {

  constructor() {
    super()

    // Always useful, for a calendar
    const today = new Date()

    // Required by the month selector
    let currentMonth = today
    let currentMonthPage

    // Create a shadow DOM for encapsulation :
    // This means the input field and the popup will be encapsulated
    //  in the custom element when the component is mounted.
    // The mode 'open' allows the shadow DOM to be accessed from outside
    this.attachShadow({ mode: 'open' })

    // Create a popup container, hidden by default
    const popup = document.createElement('dialog')
    popup.style.position = 'absolute'
    popup.style.height = '180px'
    popup.style.padding = '20px'
    popup.style.margin = '0'
    popup.style.backgroundColor = '#FFF'
    popup.style.border = '1px solid #CCC'
    popup.style.borderBottomColor = '#BBB'
    popup.style.boxShadow = '0 5px 15px -5px rgba(0, 0, 0, 0.5)'
    popup.style.display = 'none'

    // Create a year selector, a number input field with a minimum value of 1900
    // and a maximum value of the current year (picked up from the Date object)
    const yearSelector = document.createElement('div')
      yearSelector.style.textAlign = 'center'
      const yearSelectorInput = document.createElement('input')
        yearSelectorInput.type = 'number'
        yearSelectorInput.min = 1900
        yearSelectorInput.max = today.getFullYear()
        yearSelectorInput.defaultValue = yearSelectorInput.max
        let chosenYear = yearSelectorInput.value
      yearSelector.appendChild(yearSelectorInput)
    popup.appendChild(yearSelector)

    // These function and variable declarations will be used later,
    // in order to handle the specific case of February 29th
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    let leapDay // February 29th button, will be set later

    // Create a month selector, a text display with arrows to navigate
    const monthSelector = document.createElement('div')
      monthSelector.style.padding = '10px 0'
      monthSelector.style.textAlign = 'center'
      // The previous month button, which will decrease the current month by 1
      const toPreviousMonth = document.createElement('button')
        toPreviousMonth.textContent = '<'
        toPreviousMonth.addEventListener('mousedown', () => {
          const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1)
          currentMonth = previousMonth
          currentMonthPage.style.display = 'none'
          currentMonthPage = currentMonthPage.previousElementSibling
          currentMonthPage.style.display = 'block'
          currentMonthDisplay.textContent = previousMonth.toLocaleDateString (
          this.getAttribute('lang') || undefined,{ month: 'long' })
          // Disable the previous month button if the current month is January
          if (currentMonth.getMonth()+1 === 1) toPreviousMonth.disabled = true
          // Reenable the next month button at the very end
          toNextMonth.disabled = false
        })
      monthSelector.appendChild(toPreviousMonth)

      // The current month display, which will be updated when the month changes
      // By default, it displays the current month (hence currentMonth=today above)
      // The month is displayed in full letters, with the first letter capitalized
      // In the browser system language by default, or in the language specified
      const currentMonthDisplay = document.createElement('span')
        currentMonthDisplay.style.display = 'inline-block'
        currentMonthDisplay.style.width = '6rem'
        currentMonthDisplay.style.textAlign = 'center'
        currentMonthDisplay.style.textTransform = 'capitalize'
        currentMonthDisplay.textContent = today.toLocaleDateString (
        this.getAttribute('lang') || undefined,{ month: 'long' })
      monthSelector.appendChild(currentMonthDisplay)

      // The next month button, which will increase the current month by 1
      const toNextMonth = document.createElement('button')
        toNextMonth.textContent = '>'
        toNextMonth.addEventListener('mousedown', () => {
          const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1)
          currentMonth = nextMonth
          currentMonthPage.style.display = 'none'
          currentMonthPage = currentMonthPage.nextElementSibling
          currentMonthPage.style.display = 'block'
          currentMonthDisplay.textContent = nextMonth.toLocaleDateString (
          this.getAttribute('lang') || undefined,{ month: 'long' })
          // Disable the next month button if the current month is December
          if (currentMonth.getMonth()+1 === 12) toNextMonth.disabled = true
          // Reenable the previous month button at the very end
          toPreviousMonth.disabled = false
        })
      monthSelector.appendChild(toNextMonth)
    popup.appendChild(monthSelector)

    // This array contains 12 arrays (one for each month)
    // Each month array contains 29-31 buttons (one for each day)
    Array.from({ length: 12 }, (monthArray,month) => {
      const monthPage = document.createElement('div')
        monthPage.style.display = 'none'
        monthPage.id = 'month-' + (month+1)
        if (month === today.getMonth()) {
          currentMonthPage = monthPage
          monthPage.style.display = 'block'
        }
        monthArray = Array.from({ length: 31 }, (_,day) => {
          // Stop at 29 for February
          if (month+1 == 2 && day+1 > 29) return
          // Stop at 30 for 30 days months
          if ([4,6,9,11].includes(month+1) && day+1 > 30) return

          const textButton = document.createElement('button')
          textButton.textContent = (day+1).toString()
          textButton.style.width = '30px'

          // Clicking on a day button will set the encapsulated input field value
          // to the corresponding date :
          // - The day is the text displayed on the button,
          // - The month is the current page of our "year" table,
          // - The year is the value of the yearSelector input field.
          // The default format is DD/MM/YYYY, with leading zeros for days and months.
          textButton.addEventListener('mousedown', () => {
            this.inputField.value =
            // MDY for US format :
            this.getAttribute('format') == 'MDY' ? 
                (month+1).toString().padStart(2,'0') + '/' + 
                (day+1).toString().padStart(2,'0') + '/' +
                chosenYear.toString()
            // YMD for ISO format :
          : this.getAttribute('format') == 'YMD' ? 
                chosenYear.toString() + '/' +
                (month+1).toString().padStart(2,'0') + '/' + 
                (day+1).toString().padStart(2,'0')
          : // DMY is the default format :    
                (day+1).toString().padStart(2,'0') + '/' + 
                (month+1).toString().padStart(2,'0') + '/' + 
                chosenYear.toString()
            popup.style.display = 'none'
          })

          // Append each button to the month page
          monthPage.appendChild(textButton)

          // Every 7 buttons, add a line break
          if ((day+1) % 7 === 0) monthPage.appendChild(document.createElement('br'))

          // February 29th is a special case, so it's put in our variable leapDay
          // (declared above), and hidden if the year is not a leap year
          if (month+1 == 2 && day+1 == 29) {
            leapDay = textButton
            if (!isLeapYear(chosenYear)) leapDay.style.display = 'none'
          }
        })
      // Append each month page to the popup
      popup.appendChild(monthPage)
    })

    // Check if the year displayed in the input field is a leap year
    // Display the leap day button (February 29) if it is.
    yearSelector.addEventListener('change', (event) => {
      chosenYear = parseInt(event.target.value)
      if (isLeapYear(chosenYear)) leapDay.style.display = ''
      else leapDay.style.display = 'none'
    })

    // Append the popup to the shadow DOM
    this.shadowRoot.appendChild(popup)

    // Initialize the input field
    this.inputField = document.createElement('input')
    this.shadowRoot.appendChild(this.inputField)

    this.inputField.addEventListener('focus', () => {
      // Use requestAnimationFrame to ensure the coordinates are correct
      requestAnimationFrame(() => {
        // Obtain configurable parameters with default values
        const defaultTop = this.getAttribute('top') || 4 // 4px down by default
        const defaultLeft = this.getAttribute('left') || 0 // 0px right by default
        // Calculate the position relative to the input field
        const inputRect = this.inputField.getBoundingClientRect()
        // Adjust the vertical position according to the scroll height
        const verticalScrollOffset = window.pageYOffset || document.documentElement.scrollTop
        // Adjust the horizontal position according to the scroll width
        // (should be 0 because horizontal scroll is bad, but just in case)
        const horizontalScrollOffset = window.pageXOffset || document.documentElement.scrollLeft
        popup.style.top = inputRect.bottom + verticalScrollOffset + defaultTop + 'px'
        popup.style.left = inputRect.left + horizontalScrollOffset + defaultLeft + 'px'
        popup.style.display = 'block'

        // Check if the bottom of the popup is off-screen
        // If so, move the popup above the input field
        const popupRect = popup.getBoundingClientRect()
        const screenHeight = window.innerHeight
        if (popupRect.bottom > screenHeight) {
          popup.style.top = inputRect.top + verticalScrollOffset - defaultTop - 220 + 'px'
        }
      })
    })

    // Add a mousedown event listener on the custom element (this)
    // to prevent the popup from closing when clicking on it (see below)
    let clickPopup = false
    document.addEventListener('mousedown', (event) => {
      // if clickPopup is already true but this.contains(event.target) is false,
      // then popup.style.display = 'none' will be executed
      if (clickPopup && !this.contains(event.target)) {
        popup.style.display = 'none'
      }
      // else, determines if the click is on the popup or not
      clickPopup = this.contains(event.target)
    })

    // When focus is lost on the input field, hide the popup
    // unless the click was on the popup itself (see above).
    // The timeout is necessary to prevent the popup from closing
    // before the click event on a day button is triggered.
    this.inputField.addEventListener('blur', () => {
      if (clickPopup) return
      setTimeout(() => popup.style.display = 'none', 100)
    })
  }
  
  // Deleting all event listeners when unmounting the component, to avoid memory leaks
  disconnectedCallback() {
    this.removeEventListener('mousedown', this.handleMousedown)
    this.inputField.removeEventListener('focus', this.handleFocus)
    this.inputField.removeEventListener('blur', this.handleBlur)
    this.textButton.removeEventListener('mousedown', this.handleMousedown)
    this.yearSelector.removeEventListener('change', this.handleYearChange)
    this.toPreviousMonth.removeEventListener('mousedown', this.handlePreviousMonth)
    this.toNextMonth.removeEventListener('mousedown', this.handleNextMonth)
  }
}

// Define the custom tag that will encapsulate the input field
// Custom tags MUST contain a dash (-) in their name
customElements.define('date-picker', DatePicker)