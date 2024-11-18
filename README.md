# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development


### The setup process:

- I started the project structure with `npx create-remix@latest` with is reffered in oficial documentation of remix.

Generate the database types:
```shellscript
npx prisma generate
```


Run the dev server:

```shellscript
npm run dev
```

### Technical Decisions:
- As you can imagine used `prisma` for database operations :)
- At first I consider create a small expressjs api server, but after reading Remix docs I noticed that I don't need an additional api server.
- Preferred `zod` for form validations, since it has great typescript support, easy for managing custom error messages, and you can use prisma enum types directly.


### SSR approach
- Used `.server.ts` file system convension. Seperated db models as a single `.server` file
- Accessed data via loader and action functions.

### Database design
- Created a database using `schema.prisma` file. Added an additional migration and generated over schema file.
- Created a `User` model with `id`, `first_name`, `last_name`, `email`, `thumbnail_url`,`gender`(enum)
- Created a `GuestBookEntry` model with `id`, `content`, `userId` relation with `User` modal
- `User` modal has one-to-many relation with `GuestBookEntry`

### Improvements
- I'd like to add more error handling and logging on third party tools like datahog for more observability.
- Could set easy client side caching with `remix-client-cache` library. Personally, I prefer using `redis` on bigger projects when necessary
- Could add pagination when listing all users
