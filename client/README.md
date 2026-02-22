# Client Directory

This directory is reserved for client-specific files that should **never** be overwritten by template updates.

## What goes here

- Custom configuration files
- Client-specific assets or data
- Override files for template components
- Any files unique to this deployment

## Protected by `.gitattributes`

Everything in `client/` uses the `merge=ours` strategy, so `git merge template/main` will never overwrite these files.

## What goes in the root

Standard template files (pages, components, lib) live in the root directory and receive updates from the template upstream.
