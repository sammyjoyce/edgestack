# Template Author Guide

This document explains how to create modules and templates that work with
`asinit`. Follow these guidelines to ensure your templates integrate
smoothly and can be updated over time.

## Module Layout

Modules live inside the `modules/` directory. Each module has its own
subdirectory along with a JSON definition file named `{name}.json`. The
file declares the module name, version, dependencies, template files and
any codemod scripts.

An example layout for a module called `auth`:

```text
modules/
  auth.json
  auth/
    login.tmpl
    codemods/
      add_route.json
```

### Definition File

The JSON definition must use the following fields:

- `name` – unique module name
- `version` – module version string
- `dependencies` – array of other module names (optional)
- `templates` – array of `{ "path": "file", "destination": "file" }` objects
- `codemods` – array of codemod script paths (optional)

A minimal definition looks like:

```json
{
  "name": "auth",
  "version": "1.0.0",
  "templates": [
    {"path": "login.tmpl", "destination": "src/login.js"}
  ]
}
```

## Writing Templates

Template files are plain text with `{{name}}` placeholders. During
`init` or `add`, the CLI replaces each placeholder with the value from
variables passed by the user. Unknown variables cause an error, so check
that every placeholder is listed in your module instructions.

Templates should be deterministic: avoid reading the network or system
state when generating content. Keep paths consistent so updates can track
file origins correctly.

## Codemods

Codemod scripts let a module modify existing files after templates are
rendered. They are JSON arrays of operations such as `insert_after` or
`remove_line` (see `codemod.zig` for the full schema). List codemod file
paths in the `codemods` field of the module definition. The CLI applies
codemods in graph order after writing template files.

## Versioning and Updates

When you release a new template version, bump the `version` field. The
CLI records versions in `asinit.json` so it can later compare a project
against updated modules and apply changes safely.

---

Following these rules keeps modules compatible and allows projects to
incorporate improvements without manual merging.
