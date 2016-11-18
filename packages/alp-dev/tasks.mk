.PHONY: clean tests watch build-prod
.DEFAULT_GOAL := default

BIN = ''

# with npm run
ifeq ($(origin npm_package_version), undefined)
	BIN = node_modules/.bin/
endif

clean:
	rm -Rf public/*.css* public/*.js* public/config

default:
	$(BIN)alp-dev

build-prod:
	NODE_ENV=production $(BIN)alp-dev-build-config
	NODE_ENV=production WEBPACK_DEST=modern-browsers node_modules/.bin/webpack --hide-modules
	NODE_ENV=production WEBPACK_DEST=es5 node_modules/.bin/webpack --hide-modules
	gzip -fk9 public/modern-browsers.js
	gzip -fk9 public/es5.js
	lzma -fke9 --threads 0 public/modern-browsers.js
	lzma -fke9 --threads 0 public/es5.js
	# bro --input public/modern-browsers.js --output public/modern-browsers.js.bro
	# bro --input public/es5.js --output public/es5.js.bro
