require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: 'Gatsby with a SQL source',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: "Employee",
        fieldName: "postgres",
        dbEngine: {
          client: 'pg',
          connection: {
            host: 'baasu.db.elephantsql.com',
            user: 'kfernrec',
            password: 'QCa0fLwJGjWKwEnt2WCXttH2ntGYy2Aq',
            database: 'kfernrec'
          }
        },
        queryChain: function(x) {
          return x.select("last_name").from('public.employees').limit(8)
        }
      }
    },
    {
      resolve: `gatsby-source-sql`,
      options: {
        typeName: 'Classical',
        fieldName: 'chinook',
        dbEngine: {
          client: 'sqlite3',
          connection: {
            filename: process.env.DATAFILE,
          },
          useNullAsDefault: true
        },
        queryChain: function(x) {
          return x
            .select(
              "Track.TrackId as TrackId",
              "Track.Name as Track",
              "Album.Title as Album",
              "Genre.Name as Genre",
              "Artist.Name as Artist"
            )
            .from("Track")
            .innerJoin("Album", "Album.AlbumId", "Track.AlbumId")
            .innerJoin("Artist", "Artist.ArtistId", "Album.ArtistId")
            .innerJoin("Genre", "Genre.GenreId", "Track.GenreId")
            .where("Genre.Name", "=", "Classical")
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
