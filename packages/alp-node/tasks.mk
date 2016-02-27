.PHONY: check clean tests watch build test
.DEFAULT_GOAL := default

BIN = ''

# with npm run
ifeq ($(origin npm_package_version), undefined)
	BIN = node_modules/.bin/
endif

check:
	mkdir -p lib/config public/js/config || echo

clean:
	rm -Rf lib tests/lib public/*.css public/js public/*bundle.js*

default: check
	$(BIN)gulp

watch: check
	$(BIN)gulp watch

build: check
	$(BIN)gulp build

lint:
	@echo "> Lint files"
	@echo '>> eslint'; \
	$(BIN)eslint -c .eslintrc src/ test/src/

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
