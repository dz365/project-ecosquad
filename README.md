## Title:

- Citizen Scientist Progressive Web App (PWA)

## Team Name:

- EcoSquad

## Stack Focus

- Focus will be evenly divided between the frontend and backend aspects
- Backend focus will be towards the PWA aspects of the app
- Frontend focus will be towards the incorporation of an interactive map

## Team Members

**Daniel Zhang** 1006057892 \
**Andy Lima** 1006015161

## App Description

The goal of this app is to give everybody an opportunity to contribute to the understanding of our planet through their own personal observations. Everybody can get the chance to experience what it's like being a scientist without needing scientific training, money or time. As long as they are curious about something and/or want to note down their own discoveries, this app will provide a place to do so.

For example, one might record and share photos of the existing wildlife in their neighbourhood using the app. Over time, one might learn more about how some of those species thrive, and they could continue to share more observations with the rest of the world.

Users will also get the chance to explore what other users are sharing and if interested, follow others or a particular topic, so that they can get notified of the newest discoveries.

## Complexity Points

| Complexity  | Points | Envisioned Usage                                                          |
| ----------- | ------ | ------------------------------------------------------------------------- |
| Meilisearch | 3      | Search and filter options to view posts displayed on the interactive map. |
| SendGrid    | 2      | Periodically sending email for followed topics                            |
| Auth0       | 1      | Authorization and authentication purposes                                 |
| Unovis      | 1      | Interactive map that users can add posts and filter posts                 |

Currently, no bonus complexity points are planned. However, if we decide on having new features that require additional complexity, then they will be included below.

## Targets for Alpha, Beta, & Final

**Alpha**

- Account related aspects
  - Create & delete account
  - Sign in & sign out
  - User profile
- Add and display discoveries on an interactive map
- Some styling to follow standard UI UX design

**Beta**

- Allow users to filter and search for data points on the map using Meilisearch
- Allow users to follow other users and topics
- Send periodic emails for followed topics
- Further styling

**Final**

- Polished UI & UX
- Deploy app
