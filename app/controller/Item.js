export default class {
    constructor(image, title, description, owner, price) {
      this._image = image;
      this._title = title;
      this._description = description;
      this._owner = owner;
      this._price = price;
    }
  
    // Getter for image
    get image() {
      return this._image;
    }
  
    // Setter for image
    set image(newImage) {
      this._image = newImage;
    }
  
    // Getter for title
    get title() {
      return this._title;
    }
  
    // Setter for title
    set title(newTitle) {
      this._title = newTitle;
    }
  
    // Getter for description
    get description() {
      return this._description;
    }
  
    // Setter for description
    set description(newDescription) {
      this._description = newDescription;
    }
  
    // Getter for owner
    get owner() {
      return this._owner;
    }
  
    // Setter for owner
    set owner(newOwner) {
      this._owner = newOwner;
    }
  
    // Getter for price
    get price() {
      return this._price;
    }
  
    // Setter for price
    set price(newPrice) {
      this._price = newPrice;
    }
  }
  
  