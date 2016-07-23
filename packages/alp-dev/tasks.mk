.PHONY: check clean tests watch build test
.DEFAULT_GOAL := default

BIN = ''

# with npm run
ifeq ($(origin npm_package_version), undefined)
	BIN = node_modules/.bin/
endif

check:
	mkdir -p lib/config public/config || echo

clean:
	rm -Rf lib tests/lib public/*.css* public/*.js* public/config

default: check
	$(BIN)gulp

watch: check
	$(BIN)gulp watch

build-dev: check
	$(BIN)gulp build
	node_modules/.bin/webpack

build-prod: check
	NODE_ENV=production $(BIN)gulp build --production
	NODE_ENV=production WEBPACK_DEST=es5 node_modules/.bin/webpack
	NODE_ENV=production WEBPACK_DEST=modern-browsers node_modules/.bin/webpack

lint:
	@echo "> Lint files"
	@echo '>> eslint'; \
	$(BIN)eslint --ext .js,.jsx --fix -c .eslintrc src/ test/src/

lint-fix:
	$(BIN)eslint --fix -c .eslintrc src/ test/src/

test:
	@echo "> Building"
	$(BIN)babel --presets es2015-node5 -s --out-dir test/lib test/src
	@echo "> Run tests"
	$(BIN)mocha --harmony --es_staging --recursive --bail -u tdd test/lib

browser-test:
	@echo "> Browser test"
	@mkdir -p dist
	$(BIN)browserify -d -e test/browser/index.js -o dist/test.js -t [ babelify --presets [ es2015 ] ]
	@echo "> Browser test: run karma"
	$(BIN)karma run
