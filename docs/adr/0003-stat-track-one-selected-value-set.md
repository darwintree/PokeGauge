# Stat Track has one selected Stat Value set

Stat Track used to keep Choice selection and Range interval as two stores, with `touched` protection and Range→Choice four-corner writeback. Choice and Range are now two modes of one selected Stat Value set: Range is that set's axis-aligned envelope, parent-row expand is a read-only Choice view of the same set, and missing envelope endpoints become Temporary Stat Values only when entering Range or dragging.

## Considered Options

- Two independent stores (the previous implementation). Mode switches convert or preserve by `touched`, so the visible Range can diverge from the dormant Choice selection that parent-row expand shows.
- Convert on every switch. Choice→Range always re-envelopes; Range→Choice always replaces selection with endpoints. This keeps modes in sync at switch time but destroys the other mode's working set.
- One selected Stat Value set (chosen). Mode is presentation and Scenario cardinality, not a second value store.
