
    - wcs-manifest.json:
        - Adjust the general parts like title, description, ...
        - Adjust the configuration part with all possible configuration options (https://webcomponents.opendatahub.bz.it/getting-started)

# wembcomp-creative-industries

This project will display the entities located in South Tyrol and working in the Creative Industries on a map.

## Table of contents

- [Usage](#usage)
- [Gettings started](#getting-started)
- [Linting](#linting)
- [Deployment](#deployment)
- [Docker environment](#docker-environment)
- [Information](#information)

## Usage

Include the webcompscript file `sit/webcomp-creative-industries.js` in your HTML and define the web component like this:

```html
<webcomp-creative-industries locale="en"></webcomp-creative-industries>
```

### Attributes

#### locale

The description of the parameter xxx.

Type: string
Options: "en", "de", "it"


## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 12 / NPM 6

For a ready to use Docker environment with all prerequisites already installed and prepared, you can check out the [Docker environment](#docker-environment) section.

### Source code

Get a copy of the repository:

```bash
git clone git@github.com:noi-techpark/webcomp-creative-industries.git
```
or alternatively:
```bash
git clone https://github.com/noi-techpark/webcomp-creative-industries.git
```

Change directory:

```bash
cd webcomp-creative-industries/
```

### Dependencies

Download all dependencies:

```bash
npm install
```

### Build

Build and start the project:

```bash
npm run start
```

The application will be served and can be accessed at [http://localhost:8080](http://localhost:8080).

## Linting

Linting can be executed with the following commands:

```bash
npm run lint
```

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build:wc
```

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependenices

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "npm install"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

After finished working you can stop the Docker containers:

```
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose run --rm app /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose run --rm app /bin/bash -c "npm run start"
```

## Information

### Support

For support, please contact [info@opendatahub.bz.it](mailto:info@opendatahub.bz.it).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `development` branch.

- Make sure the tests are passing.

- Create a pull request against the `development` branch.

A more detailed description can be found here: [https://github.com/noi-techpark/documentation/blob/master/contributors.md](https://github.com/noi-techpark/documentation/blob/master/contributors.md).

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.
