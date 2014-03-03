
build: node_modules components index.css
	@./node_modules/.bin/component build --copy
	@./node_modules/.bin/myth build/build.css build/build.css

clean:
	@rm -rf build components node_modules

components: component.json
	@./node_modules/.bin/component install

node_modules: package.json
	@npm install

server:
	@foreman start

test: build
	@open ../index.html

.PHONY: clean server test