.PHONY: check clean tests watch build

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
	@node_modules/.bin/gulp

watch: check
	@node_modules/.bin/gulp watch

build: check
	@node_modules/.bin/gulp build

w: clean build watch

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
