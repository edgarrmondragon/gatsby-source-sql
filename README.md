# gatsby-source-sql

Plugin for connecting arbitrary SQL databases to Gatsby. Supported SQL databases are MySQL/MariaDB, PostgreSQL, Amazon Redshift, SQLite3, Oracle and MSSQL.

- [Example website][1]
- [Example website source][2]

## Install

```
npm install --save git+https://github.com/mrfunnyshoes/gatsby-source-sql.git
```

## How to use

First, you need a way to pass environment variables to the build process, so  database username and password, and other secured data aren't committed to source control. We recommend using [`dotenv`][dotenv] which will then expose environment variables. [Read more about dotenv and using environment variables here][env-vars]. Then we can use these environment variables and configure our plugin.

This plugin uses [`knex`][knex] to build and run SQL queries. We recommend you to take a look at [the knex docs][knex-docs] to get familiar with building queries.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      // Querying to a SQLite database
      resolve: `gatsby-source-sql`,
      options: {
        // This type will contain the Query type, e.g. allNirvana
        typeName: 'Nirvana',
        // This is field under which it will be accessible in a future version
        fieldName: 'chinook',
        // Knex database engine configuration
        dbEngine: {
          client: 'sqlite3',
          connection: {
            filename: process.env.DATAFILE,
          },
          useNullAsDefault: true
        },
        // The query method chain to run on the connection
        queryChain: function(x) {
          return x
            .select(
              "Track.TrackId as TrackId",
              "Track.Name as Track",
              "Album.Title as Album",
              "Genre.Name as Genre"
            )
            .from("Track")
            .innerJoin("Album", "Album.AlbumId", "Track.AlbumId")
            .innerJoin("Artist", "Artist.ArtistId", "Album.ArtistId")
            .innerJoin("Genre", "Genre.GenreId", "Track.GenreId")
            .where("Artist.Name", "=", "Nirvana")
        }
      }
    },
    {
      // Querying to a PostgreSQL database
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "Employees",
        fieldName: "postgres",
        dbEngine: {
          // Pass the appropriate envvars for a PostgreSQL connection
          client: 'pg',
          connection: {
            host: process.env.PG_HOST,
            user: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            database : process.env.PG_DATABASE
          }
        },
        queryChain: function(x) {
          return x
            .select("last_name", "title")
            .from('employees')
            .limit(15)
        }
      }
    },
  ]
```

## How to Query

```graphql
query {
  allNirvana(filter: {Album: {eq: "Nevermind"}}) {
    edges {
      node {
        id
        TrackId
        Track
        Album
        Genre
      }
    }
  }
  allEmployees {
    edges {
      node {
        id
        last_name
        title
      }
    }
  }
}
```

## TODOS

- Namespace queries inside `fieldName`.

### Example

```graphql
query {
  chinook {
    allNirvana(filter: {Album: {eq: "Nevermind"}}) {
      edges {
        node {
          id
          TrackId
          Track
          Album
          Genre
        }
      }
    }
  }
  postgres {
    allEmployees {
      edges {
        node {
          id
          last_name
          title
        }
      }
    }
  }
}
```

- Add this plugin to the official Gatsby repo.


[1]: https://mrfunnyshoes.github.io/gatsby-source-sql/
[2]: https://github.com/mrfunnyshoes/gatsby-source-sql/tree/example-site
[dotenv]: https://github.com/motdotla/dotenv
[env-vars]: https://gatsby.app/env-vars
[knex]: https://github.com/tgriesser/knex
[knex-docs]: https://knexjs.org
