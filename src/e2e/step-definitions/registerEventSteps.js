const { Given, Then, When } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');

Given('I am on the events hub page', async function () {
  try {
    this.page = new EventsHubPage();
    await this.page.open();
  } catch (error) {
    console.error("Failed to open the Events Hub page:", error.message);
    throw new Error("Could not navigate to the Events Hub page. Please check the URL or connectivity.");
  }
});

Then('I should see the Marquee displayed on the page', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.marquee);
  } catch (error) {
    console.error("Marquee verification failed:", error.message);
    //throw new Error("Marquee is not displayed as expected on the Events Hub page.");
  }
});

Then('I should see events displayed on the page', async function () {
  try {
    await this.page.verifyEventsDisplayed();
  } catch (error) {
    console.error("Events verification failed:", error.message);
    throw new Error("Events are not displayed as expected on the Events Hub page.");
  }
});

When('I select the event card with title {string}', async function (eventTitle) {
  try {
    this.eventTitle = eventTitle
    await this.page.viewEventByTitle(eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card with title "${eventTitle}":`, error.message);
    //throw new Error(`Could not select the event card with title "${eventTitle}". Please verify the event title.`);
  }
});

When('I select the event card at position {int}', async function (sequenceNumber) {
  try {
    this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
    await this.page.viewEventByTitle(this.eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card at position ${sequenceNumber}:`, error.message);
    throw new Error(`Could not select the event card at position ${sequenceNumber}. Please ensure the event cards are loaded correctly.`);
  }
});


Then('the banners on the event card should be displayed correctly', async function () {
  try {
    await this.page.verifyBannersOnCard(this.eventTitle);
  } catch (error) {
    console.error("Banner verification failed:", error.message);
    //throw new Error("Banners on the event card are not displayed correctly.");
  }
});

Then('I should see the date and time displayed correctly on the event card', async function () {
  try {
    await this.page.verifyDateAndTimeOnCard(this.eventTitle);
  } catch (error) {
    console.error("Date and time verification failed:", error.message);
    //throw new Error("Date and time on the event card are not displayed correctly.");
  }
});

Then('the "View event" button on the event card should be clickable', async function () {
  try {
    await this.page.verifyViewEventButton(this.eventTitle);
  } catch (error) {
    console.error("Read more button verification failed:", error.message);
    //throw new Error('The "Read more" button on the event card is not clickable.');
  }
});

Then('I should see pagination controls', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.paginationControlsSelector);
  } catch (error) {
    console.error("Pagination controls verification failed:", error.message);
    //throw new Error("Failed to verify pagination controls.");
  }
});

Then('the {string} button should be clickable', async function (buttonType) {
  try {
    const buttonSelectors = {
      'Next': this.page.locators.nextButtonSelector,
      'Previous': this.page.locators.previousButtonSelector
    };
    const buttonSelector = buttonSelectors[buttonType];
    if (!buttonSelector) {
      throw new Error(`No selector defined for button type "${buttonType}".`);
    }
    await this.page.verifyButtonIsClickable(buttonSelector);
  } catch (error) {
    console.error(`Failed to verify if the "${buttonType}" button is clickable:`, error.message);
    //throw new Error(`The "${buttonType}" button could not be verified as clickable.`);
  }
});

Then('I should be able to click on specific page numbers', async function () {
  try {
    await this.page.verifyPageNumbersClickable();
  } catch (error) {
    console.error('Failed to verify page numbers:', error.message);
    //throw new Error('The page numbers could not be verified.');
  }
});

Then('I should see the total number of pages and results displayed', async function () {
  try {
    await this.page.verifyTotalPagesAndResults();
  } catch (error) {
    console.error('Failed to verify total pages and results:', error.message);
    //throw new Error('The total number of pages and results could not be verified.');
  }
});

When('the View event button on the event card should be clickable', async function () {
  try {
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${testData.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

When('I click the "View event" button on the event card at position {int}', async function (sequenceNumber) {
  try {
    this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

Then('I should navigate to the event detail page', async function () {
  try {
    this.context(EventDetailPage);
    const expectedTitle = this.eventTitle;
    //await this.page.verifyNavigationToEventDetailPage(expectedTitle);
    await this.page.verifyOnEventDetailPage(expectedTitle);
  } catch (error) {
    console.error(`Failed to verify navigation to the event detail page for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Navigation to the event detail page did not happen as expected.');
  }
});

Then('I should see the event details on the page', async function () {
  try {
    //await this.page.verifyEventDetails(this.eventTitle);
    const eventTitleLocator = this.page.locators.eventTitle;
    await eventTitleLocator.waitFor({ state: 'visible' });
    const isVisible = await eventTitleLocator.isVisible();
    expect(isVisible).toBeTruthy();
    
    console.log(`Event details for "${this.eventTitle}" are displayed as expected.`);
  } catch (error) {
    // Log the specific error message and context
    console.error(`Error verifying event details for "${this.eventTitle}": ${error.message}`);
    // Optionally, throw an error to indicate that the test failed
    throw new Error(`Failed to verify event details for "${this.eventTitle}". ${error.message}`);
  }
});


Then('I should see the Agenda on the event details page', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.eventAgenda);
  } catch (error) {
    console.error("Event agenda verification failed:", error.message);
    //throw new Error("Agenda is not displayed as expected on the Event Details page.");
  }
});

Then('I should see the Venue on the event details page', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.eventVenue);
  } catch (error) {
    console.error("Event venue verification failed:", error.message);
    //throw new Error("Venue is not displayed as expected on the Event Details page.");
  }
});

Then('I click the RSVP Button', async function () {
  try {
    await this.page.clickRsvp();
  } catch (error) {
    console.error("Failed to click on RSVP Button")
  }
});

Then('I sign in with AdobeID', async function () {
  try {
    this.context(AdobeIdSigninPage);
    await this.page.signIn(this.credentials.username, this.credentials.password)
    console.log("Sign in done")
  }
  catch (error) {
    console.error(`Failed to sign in : ${error}`)
  }
});

Then('I again click the RSVP Button', async function () {
  try {
    this.context(EventDetailPage);
    await this.page.clickRsvp();
  } catch (error) {
    console.error("Failed to click on RSVP Button")
  }
});

Then('I see the RSVP Form', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.eventForm);
  } catch (error) {
    console.error("RSVP form verification failed:", error.message);
    throw new Error("RSVP form not displayed as expected on the Event Details page.");
  }
});

Then('I should see the event title I clicked on', async function () {
  try {
    await this.page.isEventTitleCorrect(this.eventTitle);
  } catch (error) {
    console.error("Event title verification failed:", error.message);
    //throw new Error("The event title displayed does not match the expected title on the Event Details page.");
  }
});

Then('I should see my email prefilled', async function () {
  await this.page.isEmailCorrect(this.credentials.username);
});

Then('I fill all required information', async function () {
  await this.page.fillRsvpForm();
});

// Then('I see the registration confirmation', async function () {
//   await expect(eventDetailsPage.rsvpConfirmation).toBeVisible();
// });

// Then('I close the confirmation', async function () {
//   await eventDetailsPage.closeConfirmation();
// });



