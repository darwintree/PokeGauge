# Setup Bookmarks reuse share Scenario Setup semantics

PokeGauge lets a user keep Setup Bookmarks: explicitly saved Scenario Setups that copy back into the current workspace. A bookmark stores the share token produced by the same encoder as a share link, so it is recalculated with current resources, cannot be saved if it could not be shared, and becomes Unloadable if that token version or domain check fails. Loading decodes that token in-app with the same Setup-to-TrackState path as share restore; it does not navigate to `?s=` and it clears a share param already in the address bar. It is not a refresh Track snapshot and not a frozen result. Loading does not bind the workspace to the bookmark. An Unloadable bookmark stays listed and is not opened.

## Considered Options

- Reuse the local refresh snapshot. That would restore candidate pools and display state, but diverge from share and from Scenario Setup.
- Store frozen calculation results. That creates a historical-numbers contract the rest of the product does not have.
- Persist the Setup fields as local JSON without the share token. That avoids the portable URL length cap, but splits codecs and lets bookmarks exist that cannot be shared.
- Persist the share token. One encoder, one failure model, one expiry rule; the URL length cap applies to Save as well as Share.
- Load by navigating to `?s=<token>`. That reuses boot, but conflates bookmarks with inbound share links and can re-apply the URL on refresh.

## Consequences

- Save fails when a share URL would fail, including the portable length cap.
- Loading copies Setup into the workspace and clears `?s=`; later Track edits do not write back to the bookmark.
- A breaking share-token version makes stored bookmarks Unloadable instead of migrating them.
