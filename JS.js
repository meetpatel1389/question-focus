'use strict';

// Define a class MenuButtonActions
class MenuButtonActions {
  constructor(domNode, performMenuAction) {
    this.domNode = domNode;
    this.performMenuAction = performMenuAction;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = Array.from(domNode.querySelectorAll('[role="menuitem"]')); // Select menu items into an array
    this.currentIndex = 0; // Track the currently focused menu item index

    // Initialize tabindex for all items to -1 except the first
    this.menuitemNodes.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
    });

    // Add event listeners
    this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));
    this.buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
    
    // Add keyboard event listeners to each menu item
    this.menuitemNodes.forEach((menuItem, index) => {
      menuItem.addEventListener('keydown', (event) => this.onMenuitemKeydown(event, index));
    });

    // Click outside menu should close it
    window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
  }

  // Function to open the menu
  openPopup() {
    this.menuNode.style.display = 'block';
    this.buttonNode.setAttribute('aria-expanded', 'true');
    this.menuitemNodes[0].focus();
  }

  // Function to close the menu
  closePopup() {
    this.menuNode.style.display = 'none';
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

  // Button keydown events
  onButtonKeydown(event) {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
      this.openPopup();
      event.preventDefault();
    }
  }

  // Menu item keydown events to manage focus movement
  onMenuitemKeydown(event, index) {
    const { key } = event;
    let newIndex = this.currentIndex;

    if (key === 'ArrowDown') {
      newIndex = (index + 1) % this.menuitemNodes.length;
    } else if (key === 'ArrowUp') {
      newIndex = (index - 1 + this.menuitemNodes.length) % this.menuitemNodes.length;
    } else if (key === 'Enter') {
      this.performMenuAction(this.menuitemNodes[index]);
      this.closePopup();
      this.buttonNode.focus();
    } else if (key === 'Escape') {
      this.closePopup();
      this.buttonNode.focus();
    } else {
      return; // Do nothing for other keys
    }

    // Update tabindex for roving focus and apply focus to the new item
    this.menuitemNodes[this.currentIndex].tabIndex = -1;
    this.menuitemNodes[newIndex].tabIndex = 0;
    this.menuitemNodes[newIndex].focus();
    this.currentIndex = newIndex;

    event.preventDefault();
  }

  // Handle background clicks to close the menu
  onBackgroundMousedown(event) {
    if (!this.domNode.contains(event.target)) {
      this.closePopup();
    }
  }

  // Click event handler to toggle menu
  onButtonClick(event) {
    if (this.menuNode.style.display === 'block') {
      this.closePopup();
    } else {
      this.openPopup();
    }
    event.preventDefault();
  }
}

// Initialize menu buttons
window.addEventListener('load', function () {
  function performMenuAction(node) {
    document.getElementById('action_output').value = node.textContent.trim();
  }

  const menuButtons = document.querySelectorAll('.menu-button-actions');
  menuButtons.forEach((menuButton) => new MenuButtonActions(menuButton, performMenuAction));
});
