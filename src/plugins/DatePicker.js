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
    let chosenYear
    let inputFieldHadFocus = false
    let currentMonth = today.getMonth()
    // Create a shadow DOM for encapsulation :
    // This means the input field and the popup will be encapsulated
    //  in the custom element when the component is mounted.
    // The mode 'open' allows the shadow DOM to be accessed from outside
    this.attachShadow({ mode: 'open' })

    // Create a popup container, hidden by default
    const popup = document.createElement('dialog')
    popup.style.position = 'absolute'
    popup.style.height = '230px'
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
        chosenYear = yearSelectorInput.value
      yearSelector.appendChild(yearSelectorInput)
    popup.appendChild(yearSelector)

    // THIS is actually the main function. But as it needs to be re-called
    // when the year changes, it's been put in a separate function.
    const { leapDay, februaryPageLastChild, getChosenYear, inputFieldState } = 
    this.populate(popup, currentMonth, chosenYear, inputFieldHadFocus)
    chosenYear = getChosenYear
    inputFieldHadFocus = inputFieldState
    // See populate()'s return for an explanation about leapDay and februaryPageLastChild.

    // Check if the year displayed in the input field is a leap year
    // Display the leap day button (February 29th) and hide the extra day if it is.
    yearSelectorInput.addEventListener('change', (event) => {
      chosenYear = parseInt(event.target.value)

      // Make it so that the currentMonth for which the new year is displayed
      // is the same as the one that was displayed before the year was changed,
      // Thanks to the active month page's id (the one displayed, not hidden).
      const chosenMonth = parseInt (
        popup.querySelector('div[id^="month-"][style*="display: grid"]'
      ).id.slice(-2)) - 1

      // Remove the 12 month pages from the popup, plus the month selector and 
      // the days of the week (the month selector must be created in the same scope
      // as the month pages, and the days of the week just happen to be between
      // the month selector and the month pages), hence 14.
      for (let i = 0 ; i < 14 ; i++) popup.removeChild(popup.lastChild)

      // Force garbage collection to prevent memory leaks (Chrome only)
      if (typeof window.gc === 'function') window.gc()

      // Re-populate the popup with the new year
      this.populate(popup, chosenMonth, chosenYear, inputFieldHadFocus)
      
      if (this.isLeapYear(chosenYear)) {
        leapDay.style.display = ''
        februaryPageLastChild.style.display = 'none'
      } else {
        leapDay.style.display = 'none'
        februaryPageLastChild.style.display = ''
      }
      if (inputFieldHadFocus) yearSelectorInput.focus()
    })
    // If the year was changed with the mouse wheel, we need to re-focus the input field
    // so that we can keep scrolling through the years. InputFieldHadFocus is how.
    yearSelectorInput.addEventListener('focus',() => inputFieldHadFocus = true )
    yearSelectorInput.addEventListener('blur', () => {
      if (yearSelectorInput.value < yearSelectorInput.min)
        yearSelectorInput.value = yearSelectorInput.min
      if (yearSelectorInput.value > yearSelectorInput.max)
        yearSelectorInput.value = yearSelectorInput.max
      inputFieldHadFocus = false
    })

    // If the mouse wheel is used over the year selector that doesn't have focus,
    // Gives it focus and prevents the page from scrolling (and changes the year)
    yearSelectorInput.addEventListener('wheel', (event) => {
      event.preventDefault()
      yearSelectorInput.focus()
      // The delta is positive if the wheel is scrolled up, negative if down
      const delta = event.deltaY < 0 ? 1 : -1;
      // Reduce memory usage by preventing the year from going out of bounds
      if (!(yearSelectorInput.value < yearSelectorInput.min && delta < 0) &&
          !(yearSelectorInput.value > yearSelectorInput.max && delta > 0)) {
        yearSelectorInput.value = parseInt(yearSelectorInput.value) + delta
        yearSelectorInput.dispatchEvent(new Event('change'))
      }
    })

    // Initialize the input field, actually the shadow of the one encapsulated
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
        // Updates chosenYear with the value of the yearSelector input field
        chosenYear = yearSelectorInput.value
        // Check if the bottom of the popup is off-screen
        // If so, move the popup above the input field
        const popupRect = popup.getBoundingClientRect()
        const screenHeight = window.innerHeight
        if (popupRect.bottom > screenHeight) {
          popup.style.top = inputRect.top + verticalScrollOffset - defaultTop - 271 + 'px'
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

    // Append the popup to the shadow DOM
    this.shadowRoot.appendChild(popup)
  }

  isLeapYear(year) { return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) }

  populate(popup, currentMonth, chosenYear, inputFieldHadFocus) {
    // Required by the month selector
    let currentMonthPage
    // Required by the month array builder
    let monthLength = 31
    let previousMonthLength = 31
    // Required for handling February 29th shenanigans
    let februaryPageLastChild
    let leapDay
    // Create a month selector, a text display with arrows to navigate
    const monthSelector = document.createElement('div')
      monthSelector.style.padding = '10px 0'
      monthSelector.style.textAlign = 'center'
      // The previous month button, which will decrease the current month by 1
      const toPreviousMonth = document.createElement('button')
        if (currentMonth+1 === 1) toPreviousMonth.disabled = true
        toPreviousMonth.textContent = '<'
        toPreviousMonth.addEventListener('mousedown', () => {
          const previousMonth = new Date(chosenYear, currentMonth-1)
          currentMonth--
          currentMonthPage.style.display = 'none'
          currentMonthPage = currentMonthPage.previousElementSibling
          currentMonthPage.style.display = 'grid'
          currentMonthDisplay.textContent  = previousMonth.toLocaleDateString (
          this.getAttribute('lang') || undefined,{ month: 'long' })
          // Disable the previous month button if the current month is January
          if (currentMonth+1 === 1) toPreviousMonth.disabled = true
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
          currentMonthDisplay.textContent  = new Date(chosenYear, currentMonth).toLocaleDateString (
        this.getAttribute('lang') || undefined,{ month: 'long' })
      monthSelector.appendChild(currentMonthDisplay)

      // The next month button, which will increase the current month by 1
      const toNextMonth = document.createElement('button')
        if (currentMonth+1 === 12) toNextMonth.disabled = true
        toNextMonth.textContent = '>'
        toNextMonth.addEventListener('mousedown', () => {
          const nextMonth = new Date(chosenYear, currentMonth+1)
          currentMonth++
          currentMonthPage.style.display = 'none'
          currentMonthPage = currentMonthPage.nextElementSibling
          currentMonthPage.style.display = 'grid'
          currentMonthDisplay.textContent  = nextMonth.toLocaleDateString (
          this.getAttribute('lang') || undefined,{ month: 'long' })
          // Disable the next month button if the current month is December
          if (currentMonth+1 === 12) toNextMonth.disabled = true
          // Reenable the previous month button at the very end
          toPreviousMonth.disabled = false
        })
      monthSelector.appendChild(toNextMonth)
    popup.appendChild(monthSelector)

    // Display days of the week
    const weekDays = document.createElement('div')
      weekDays.style.display = 'grid'
      weekDays.style.gridTemplateColumns = 'repeat(7, 40px)'
      Array.from({ length: 7 }, (_,day) => {
        const weekDay = document.createElement('span')
          weekDay.textContent = new Date(0,0,day+1).toLocaleDateString (
          this.getAttribute('lang') || undefined,{ weekday: 'short' })
          weekDay.textContent = weekDay.textContent.slice(0, -1)
          weekDay.style.display = 'inline-block' 
          weekDay.style.width = '35px'
          weekDay.style.textTransform = 'capitalize'
          weekDay.style.textAlign = 'center'
        weekDays.appendChild(weekDay)
      })
    popup.appendChild(weekDays)

    // This array contains 12 arrays (one for each month)
    // Each month array contains 29-31 buttons (one for each day)
    Array.from({ length: 12 }, (monthArray,month) => {
      const monthPage = document.createElement('div')
        monthPage.style.gridTemplateColumns = 'repeat(7, 30px)'
        monthPage.style.gridTemplateRows = 'repeat(6, 24px)'
        monthPage.style.columnGap = '10px'
        monthPage.style.margin = '0 3px'
        monthPage.style.display = 'none'
        monthPage.id = 'month-' + (month+1).toString().padStart(2,'0')
        if (month === currentMonth) {
          currentMonthPage = monthPage
          monthPage.style.display = 'grid'
        }

        // 11 days are added to the month length to display the previous month
        // and the next month, in order to fill the first and last weeks.
        // We're doing this here :
        const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        const firstDay = new Date(chosenYear, month, 1).toLocaleDateString('en-US', {weekday: 'long'})
        const firstDayIndex = weekDays.indexOf(firstDay)

        // By default, months have 31 days
        monthLength = 31
        previousMonthLength = 31
        // Some months have 30 days
        if ([4,6,9,11].includes(month+1)) monthLength = 30
        if ([4,6,9,11].includes(month)) previousMonthLength = 30
        // February has 28 days by default
        if (month+1 === 2) monthLength = 28
        if (month   === 2) previousMonthLength = 28

        monthArray = Array.from({ length: 31 }, (_,day) => {
          // Stop at 29 for February (leap day is handled below)
          if (month+1 === 2 && day+1 > 29) return
          // Stop at 30 for 30-day months
          if ([4,6,9,11].includes(month+1) && day+1 > 30) return
          
          if (day+1 === 1) {
            for (let i = 1 ; i <= firstDayIndex ; i++) {
              const previousMonthDay = document.createElement('button')
              previousMonthDay.classList.add('day-button', 'previous-month')
              previousMonthDay.textContent = previousMonthLength-firstDayIndex+i
              previousMonthDay.style.width = '30px'
              previousMonthDay.style.border = 'none'
              previousMonthDay.style.background = 'none'
              previousMonthDay.style.color = '#CCC'
              previousMonthDay.addEventListener('mousedown', () => {
                if (month+1 === 1) return
                toPreviousMonth.dispatchEvent(new Event('mousedown'))
              })
              monthPage.appendChild(previousMonthDay)
            }
          }

          const dayButton = document.createElement('button')
          dayButton.classList.add('day-button', 'current-month')
          dayButton.textContent = (day+1).toString()
          dayButton.style.width = '30px'
          dayButton.style.border = 'none'
          dayButton.style.background = 'none'

          // Clicking on a day button will set the encapsulated input field value
          // to the corresponding date :
          // - The day is the text displayed on the button,
          // - The month is the current page of our "year" table,
          // - The year is the value of the yearSelector input field.
          // The default format is DD/MM/YYYY, with leading zeros for days and months.
          dayButton.addEventListener('mousedown', () => {
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
          
          dayButton.addEventListener('mouseenter', () => dayButton.style.background = '#EEE')
          dayButton.addEventListener('mouseleave', () => dayButton.style.background = 'none')

          // Append each button to the month page
          monthPage.appendChild(dayButton)

          // February 29th is a special case, so it's put in our variable leapDay
          // (declared above), and hidden if the year is not a leap year
          if (month+1 === 2 && day+1 === 29) {
            leapDay = dayButton
            if (!this.isLeapYear(chosenYear)) leapDay.style.display = 'none'
          }
        })
        // Once the month array is complete, we add the remaining days of the next month
        // to reach 42 days (6 weeks of 7 days) and fill the last week.
        for (let i = 1 ; i <= 42-monthLength-firstDayIndex ; i++) {
          const nextMonthDay = document.createElement('button')
          nextMonthDay.classList.add('day-button', 'next-month')
          nextMonthDay.textContent = i.toString()
          nextMonthDay.style.width = '30px'
          nextMonthDay.style.color = '#CCC'
          nextMonthDay.style.border = 'none'
          nextMonthDay.style.background = 'none'
          nextMonthDay.addEventListener('mousedown', () => {
            if (month+1 === 12) return
            toNextMonth.dispatchEvent(new Event('mousedown'))
          })
          monthPage.appendChild(nextMonthDay)
          // We'll need this right below, outside the loop
          if (month+1 === 2 && i === 42-monthLength-firstDayIndex) {
            februaryPageLastChild = nextMonthDay
          }
        }
        // If the month is February and the year is a leap year, hide the last day
        if (month+1 === 2 && this.isLeapYear(chosenYear)) {
          monthPage.lastChild.style.display = 'none'
        }
      // Append each month page to the popup
      popup.appendChild(monthPage)
    })

    // leapDay and februaryPageLastChild are specific day buttons :
    // When the year is a leap year, leapDay is displayed and februaryPageLastChild is hidden.
    // When the year is not a leap year, leapDay is hidden and februaryPageLastChild is displayed.
    // This way, February alwars has 42 buttons displayed, like the other months.
    return { leapDay, februaryPageLastChild, chosenYear, inputFieldHadFocus }
  }
}

// Define the custom tag that will encapsulate the input field
// Custom tags MUST contain a dash (-) in their name
customElements.define('date-picker', DatePicker)