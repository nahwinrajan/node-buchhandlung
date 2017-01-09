#Node - Bookstore
a commerce showcase app.

## Package used:
- Node / Express
- MongoDB / Mongoose
- Test Driven Development
- RESTful
-

## MVP - minimum viable product
- admin can create new book listing with image for cover uploaded from admin computer
  - separate page for admin management
  - add / update / delete book
  - add / update / delete category
  - add / update / delete author
  - add / update / delete publisher
- there is working authentication system (signin, signup, signout)
  - only authenticated user can purchase book
  - anyone can see all book listing + book details
  - admin must be authenticated
- user can purchase book + prompted for payment with stripe (dummy charge)
-

## Database Structure

####Book
* id
* title: string, required, max-250, min-1
* description: text, required, min-1, html-markup-able
* price: float (2 decimal point), required, min-0
* pages: Int, required, min-1
* ISBN: text, required, min-13
* rating: Float, (1 decimal point),
* year: int / date.year (I'll need to decide)
* language: string
* cover_id: FK to image record in image table, basically a cover
* category_id
* author_id
* publisher_id
* created_at
* modified_at

:belongs_to :authors
:belongs_to :publisher (exactly one publisher)
:has_many   :image (just a cover for the time being)
:has_many   :category (just a category for each book for the time being)
:has_many   :order_items


####Author
* id            
* name    : string, required, max-25, min-1
* about         : string, max-500
* created_at
* modified_at

:has_many   :books
:has_many   :image (just a profile image for the time being)

####publisher
* id
* name        : string, max-50, required
* site        : string, url, max-100,
* about       : text, required
* created_at
* modified_at

:has_many :books
:has_many :authors

####User - Passport-local (for the sake of easy Development)
* id
* email       : string, required, valid email format
* password    : string, required, min-6, max-50
* name        : string, required, min-1
* phone       : string, min-6
* avatar_id   :
* created_at
* modified_at
* last_sign_in

:has_many :orders
:has_many :shipping_address

####shipping_address
* id
* street_1    : string, required, max-50
* street_2    : string, max-50
* state       : string, required, max-50
* zip_code    : string, required, max-10, min-6
* country     : string, required, max-50
* created_at
* modified_at

:belongs_to :user
:belongs_to :orders

####orders
* id
* totalPrice    : float(2 decimal point), required
* purchase_date : date, required
* shipment_status_id: update automatically (well that is the plan), default to process
* tracking_code : string, max-100, min-1, (would be empty at first, filled when item is shipped; well that is the plan)
* user_id
* shipping_address_id
* created_at
* modified_at

:belongs_to :user
:has_many   :shipment_status
:has_many   :order_items

####order_items
* id
* qty           : int, required, min-1
* soldPrice (each)    : float(2 decimal point), required
* books_id
* orders_id
* created_at
* modified_at

:belongs_to :order
:has_many   :books

####shipment_status - a static shipment shipment status
* id
* status        : string, max-50
- processing
- shipped
- delivered

:belongs_to   :orders
