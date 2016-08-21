
default: server

clean:
	@rm -rf build components node_modules

components: component.json
	@./node_modules/.bin/component install

node_modules: package.json
	@npm install

server: node_modules components
	@foreman start

.PHONY: clean server