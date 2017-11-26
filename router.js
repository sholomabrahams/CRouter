class CRouter {
	constructor(routes) {
		this.routes = routes;
		this.current = this.getCurrent();
		this.navigate(this.routes[location.pathname]);
	}

	navigate(destination) {
		if (destination.path.charAt(destination.path.length-1) == '/') {
			destination.path.slice(0, -1);
		}
		scroll = $('window').scrollTop();
		history.pushState(scroll, '', destination.path + (destination.query || '') + (destination.hash || ''));
		$('#cr-load').css('width', 0).removeClass('hidden');
		$.ajax({
			method: 'GET',
			url: this.routes[destination.path].location,
			success: function(e) {
				$('#cr-load').addClass('hidden');
				$('#cr-output').empty().append(e);
				try {
					destination.callback();
				} catch (e) {}
			},
			error: function(e) {
				console.log(e);
			},
			progress: function(e) {
				if (e.lengthComputable) {
					$('#cr-load .determinate').css('width', e.loaded / e.total * 100);
				} else {
					$('#cr-load').addClass('hidden');
				}
			}
		});
	}

	getCurrent() {
		return {
			//name: this.routes.filter(function(e) {return e.path == location.pathname && e.hash == location.hash}),
			path: location.pathname,
			hash: location.hash,
			query: location.search
		};
	}
}


window.onpopstate = function (event) {
	//if (location) {}
	router.navigate(router.routes[event.currentTarget.window.location.pathname]);
}



$(document).ready(function() {
	$('a').click(function(e) {
		e.preventDefault();
		router.navigate(router.routes[$(this).attr('href')]);
	});
});