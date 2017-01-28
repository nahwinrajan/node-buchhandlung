#Node - Bookstore
buchhandlung mean bookstore in German. (well that is what google translate tell me :P)

###a showcase app, showcasing capability in following skills:
- Node.JS / Express.JS
- MongoDB / Mongoose
- Passport   (local)
- RESTful site
- Stripe - payment gateway (create charge, order history)
- Integration with AWS for file storage
  - Book Cover image
- SendGrid - email delivery service
  - password reset
- Deployment to Heroku

###What are out of scope
- CMS for adding books / delete / update
- Admin panel
- Integration with FrontEnd Framework like Angular, React
- Fail Safe / Consolidation Mechanism for failure payment
  - error with createCharge on Stripe
  - Insert / Update Order in DB

## MVP - minimum viable product
- there is working authentication system (signin, signup, signout)
  - only authenticated user can purchase book
  - anyone can see all book listing + book details
  - email authentication
  - user can change name
- user can purchase book
  - add to cart
  - checkout from cart - charge user with stripe payment gateway
  - user can see transaction history

#Users
- albus@example.com
- sherlock@example.com
- charlie@example.com
- nikola@example.com
