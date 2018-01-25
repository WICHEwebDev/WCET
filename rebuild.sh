#!/bin/bash

#
# This script re-assembles the docroot inside our site repository.
#
# Usage:
#   cd top-leve/of/site/repo
#   ./rebuild.sh
#

echo "Removing docroot."
rm -rf docroot

echo "Rebuilding docroot with drush make."
drush make build.make.yml docroot --concurrency=5

echo "Restoring symlinks"
echo "docroot/themes/front"; git checkout -- docroot/themes/front;
echo "docroot/modules/wcet_migrate"; git checkout -- docroot/modules/wcet_migrate;
echo "docroot/.htaccess"; git checkout -- docroot/.htaccess;

echo "Restore symlinks to shared assets:"
echo "sites/default/files"; ln -s ../../../../../shared/files docroot/sites/default/files
echo "sites/default/settings.php"; ln -s ../../../../../shared/settings.php docroot/sites/default/settings.php
