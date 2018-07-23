# WCET Drupal Website #

## Git workflow

This repo is managed using the [Git Flow methodology](https://nvie.com/posts/a-successful-git-branching-model/). The develop branch is deployed to the development environment and the master branch is deployed to the production environment. Deployment happens when either of these branches receive a push.

[Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/) is a great way to take the guesswork out of managing a repo with Git Flow. It can be installed with Homebrew, per the instructions on the site linked earlier in this paragraph.

### Git Flow Setup
If you've never used Git Flow in this repo on your local machine, run `git flow init -d` to get started.

### Features
New features should be built using feature branches. A new feature is started using git flow by running `git flow feature start feature_name`. When work is complete, the feature can be finished by running `git flow feature finish feature_name`. At this point the feature has been merged into the `develop` branch and can be released using a release.

### Releases
To release a completed feature to `master`, use a release: `git flow release start 1.0`. Any final changes can be made to the release branch while it is open. When the release is ready to go to production, run `git flow release finish 1.0` and the branch will be merged into `master` and `develop` and tagged according to what is specified in the Git flow command (1.0 in this example).

### Hotfixes
Hotfixes are used for changes that need to go to production immediately. A hotfix is branched from `master` and then immediately merged back into `master` and `develop` when the hotfix is completed. Hotfixes are most frequently used for security updates. To start a hotfix run: `git flow hotfix start 1.1.1`. This will create a hotifx branch you can use to make all the necessary updates. When all updates are complete, run `git flow hotfix finish 1.1.1` to merge your hotfix branch into `master` and `develop`.


## Hosting

* Platform: Amazee.io
* Dev URL: http://wcet.wiche.edu.develop.us2.compact.amazee.io/
* Prod URL: https://wcet.wiche.edu/

## Local Environment
Amazee's preferred local environment is [Pygmy](https://docs.amazee.io/local_docker_development/pygmy.html), which is a Docker-based local development environment for Linux and OS X. To install Pygmy follow these steps:

1. Download and install the Docker app, as described in [Docker's documentation](https://docs.docker.com/docker-for-mac/install/).
2. Confirm that your system had Ruby installed. Mac OS X is packaged with a system version of Ruby, but it is best practice to install and manage Ruby versions using [RVM](https://rvm.io/).
3. Install the Pygmy Ruby gem: `gem install pygmy`

Now that you have Pygmy installed, follow these steps to run your site:

1. Ensure that the Docker for Mac app is running. Start as you would start any other application by double-clicking from your applications directory.
2. Open a Terminal window and navigate to your project directory, where `docker-composer.yml` is located.
3. Run `pygmy up` to start Pygmy.
4. Run `docker-compose up -d` to build the Docker container for your site and run the local environment. Once this is complete, the URL of your local environment will be displayed in your Terminal window.
5. To SSH in to your environment run `docker-compose exec --user drupal drupal bash` from inside your project root directory.

## Configuration Management

This project uses CMI for all configuration changes. All configuration is stored in the `config/default` directory. This is configured in `docroot/sites/default/all.settings.php`, but should not be changed.

In Drupal 8, all configuration and site building is done locally, exported via CMI, committed to the repo, pushed to another environment, and imported. This allows for a much simpler workflow for development especially for new features on a site already in production and among multiple developers.

Configuration covers most sitebuilding items, such as content types, fields, display modes, views, and settings on all of the above. There are some blurry areas like menus and custom blocks. For example, menus are saved in config, but menu items on a menu are considered content. Understanding what changes need to be made in the database and how to go about that while updating your local project is integral. For a CMI based workflow to move smoothly, understanding the basics of CMI is important, as well as adhering to some workflow and git patterns.

1. When working locally, until config is exported and committed, it is only stored in the database. This means you need to be careful when and how you sync your DB from other environments, for example, when you need to get updated content. Also, importing config always resets the state of the config in your database to whatever is defined in the files, thus, also blowing away any changes currently in your database.
2. Since config is described by YAML (.yml) files, it can all be version controlled, and more importantly, easily merged with config from other states/branches.
3. Lastly, it’s important to realize that the above requires working on features in an isolated environment, and understand how to successfully update that environment when needed, specifically before the feature you are currently working on is finished.

CMI tracks our changes locally that we push up, but it is also possible to make changes in other environments that are tracked by CMI.

### Branches

Regardless of the scenario, you should always be working and committing changes in a feature based branch. Never do work and make config based commits on a branch that is tracking the main workflow (develop or master, depending on the git workflow setup). This is true whether or not you are the only developer on a project.

### D8 CMI - No Upstream Changes
If there are no upstream changes, then we can use a workflow that does not incorporate any upstream (as in upstream environment changes, i.e. on production) changes into our repo. Use caution because this will destroy any upstream changes that have been made.

The general workflow requires exporting config locally, committing those changes, pushing up to another environment, then importing. In the following example we will assume that we are working on `feature_branch` and our main branch is `master`. This is a generic example - you may be working on feature_branch while your main project branch is `develop`. Whatever your main project branch is, you will never work and commit directly to it.

```bash
# start out on the feature_branch you are currently working on
git checkout feature_branch
# export config locally
drush cex
# you will be prompted with a summary of changes, you should always review this, then approve
git add --all
git commit -m “Add this cool new feature along with all the necessary config”
# get most up to date project branch
git checkout master
git pull
# rebase/merge changes into your feature branch and resolve conflicts on your feature_branch
git checkout feature_branch
git rebase master / git merge master
# merge changes back into your project branch, push up
git checkout master
git merge feature_branch
git push
# Import config to remote environment, if on acquia, you will use the following command
drush @alias.env cim vcs
# You will be prompted with an overview of changes, make sure you always review this, this is the point you can permanently destroy data if you accidentally remove something you shouldn’t
```

This workflow allows you to work remotely on a feature while pulling in other co-workers changes during your development process on your feature. You can always do the first half of this workflow to get updates from other team members that you may need before you’ve finished the feature you are working on.

At multiple points during this process you will be prompted to review changes about to be made with config export and import. You should always actually review these. This is essentially as important as reading the message telling you which way you are syncing when you sql-sync. In a production environment, the possibility of losing data exists. You can check if there are upstream client changes by either 1) reviewing the confirmation message on `drush @alias.env cim` or running a `drush cex` with the current version of code and DB locally to see if there are any changes (remember of course to export and commit your config first on your feature_branch).

### D8 CMI - With Upstream Changes

The following workflow assumes there are upstream config changes that should be incorporated into code and not overwritten. A common example of this would be maintaining contact forms. Creating a new contact form, adjusting field settings on an existing one, or changing form settings like the notification recipient, is all stored in configuration. It wouldn’t be uncommon that a client wants to update some of this content or even create new forms.

```bash
# start out on the feature_branch you are currently working on, export and commit config
git checkout feature_branch
drush cex
# you will be prompted with a summary of changes, you should always review this, then approve
git add --all
git commit -m “Add this cool new feature along with all the necessary config”
# get most up to date project branch
git checkout master
git pull
# get most up to date project DB, export any config and commit to project branch, review confirm
drush sql-sync @alias.prod @alias.local
drush cex
git add --all
git commit -m “Update with current state of client config from production”
# rebase/merge changes into your feature branch and resolve conflicts on your feature_branch
git checkout feature_branch
git rebase master / git merge master
# merge changes back into your project branch, push up
git checkout master
git merge feature_branch
git push
# Import config to remote environment, if on acquia, you will use the following command
drush @alias.env cim vcs
# You will be prompted with an overview of changes, make sure you always review this, this is the point you can permanently destroy data if you accidentally remove something you shouldn’t
```

This workflow is very similar to the first one but requires you to always check for config changes on the head DB and commit them to the project branch. This is why it is so important not to do any work/make any commits on the project branch. The project branch config should essentially always be in sync with the state of the DB on production. You are checking and updating this before every new feature push.

### Just the Workflow (long form, no comments!)

```bash
git checkout feature_branch
drush cex
git add --all
git commit -m “Add this cool new feature along with all the necessary config”
git checkout master
git pull
drush sql-sync @alias.prod @alias.local
drush cex
git add --all
git commit -m “Update with current state of client config from production”
git checkout feature_branch
git rebase master / git merge master
git checkout master
git merge feature_branch
git push
drush @alias.env cim vcs
```

## Composer

All packages in this project are managed using Composer - see composer.json for detailed information about each package. This project is built serverside, so none of the vendor directories are commited. Be sure to run `composer install` when you first download the site and `composer update` when you are pulling updates.

### Require
`composer require` is what you use to add a completely new dependency to project (adding a new Drupal module, for instance). Composer packages are named `vendor_name/package_name`. All Drupal packages are under the `drupal` namespace, i.e. `drupal/core` or `drupal/paragraphs`. When you require a new package you can also define the version or version range to include.

Add new dependency to project:

```bash
composer require “drupal/paragraphs:^1.x”
```

This adds the package to the `require` key in the `composer.json` file, downloads the appropriate version, and updates the `composer.lock` file to reflect this.

Note that if a Drupal package is a dependency, it will meet the requirement the requiring package has set for the version. If you want that package to always be up to date regardless of the requiring package's settings, you should add that module as a project dependency as well.

### Update
`composer update` allows you to update a package version. Running the command as is will attempt to update every package at the same time. For the most part, you probably won’t do this with a Drupal project unless you really know what you’re doing and this is what you want. But for a project in production, it can be potentially difficult to update everything at the same time and test everything for functionality. So, you can specify the package you want to update.

```bash
composer update drupal/paragraphs --with-dependencies
```

This will use the version rules that have been defined for the `drupal/paragraphs` package and get the most recent one that is valid, download it, and update the `composer.lock` file. Running an `update` command won’t alter the `composer.json` file.

It is best to run `update` with the `--with-dependencies` flag to ensure related packages are appropriately updated. This means that when `update` runs more than just the module could be updated, so make sure you're paying attention to what other packages are changed and you test appropriately.

Always remember to check for DB updates after updating a module or core! Occasionally, database updates will also create new config - you can run `drush cim` to check.

### Remove
`composer remove` allows you to remove a package from the dependencies.

### Patches

Composer can handle applying patches to packages. Add a patch to the `patches` key in the `composer.json` file with a description of the patch and the location of the patch as follows:

```json
{
  "patches": {
    "drupal/drupal": {
      "Fix issue with translation of blocks in core": "https://www.drupal.org/files/issues/some-patch-1543858-30.patch",
      "Fix core ajax bug": "https://www.drupal.org/files/issues/some-patch-1543858-30.patch"
    },
    "drupal/paragraphs": {
      "Some local bug fix": "./patches/some_patch_file.patch"
    }
  }
}
```

If you are adding a local patch and it is failing to apply, make sure the patch is formatted correctly. It is applied within the context of that project, not your global project. So double check the format is correct by comparing to another working patch.

You can add patches like above from a link in a ticket in an issue queue. You can also add your own local patches.

After you update the `composer.json` file with the patch, run `composer install` to apply the patch.