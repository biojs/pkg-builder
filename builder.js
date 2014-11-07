function showOptions(opts){

  this.el = opts.el;
  var self = this;

  this.browserify = "http://b.biojs.net";
  this.browserify = 'http://localhost:8090';

  $.get("http://workmen.biojs.net/all?short=1", function(pkgs){
    self.pkgs = pkgs;

    pkgs.forEach(function(el,index){

      var cont = mk("div");
      cont.className = "input-group";
      cont.style.width = "300px";

      // check box
      var boxWrapper = mk("span");
      var box = mk("input");
      box.nId = index;
      box.setAttribute("type", "checkbox");
      boxWrapper.appendChild(box);
      boxWrapper.className = "input-group-addon";
      boxWrapper.style.width = "10px";
      boxWrapper.style.textAlign= "left";
      box.style.display = "span";
      cont.appendChild(boxWrapper);

      // desc
      var desc = mk("span");
      desc.textContent = el.name + " (" + el.version + ")";
      desc.className = "input-group-addon";
      desc.style.textAlign= "left";
      desc.style.width = "90%";
      cont.appendChild(desc);

      target.appendChild(cont);    
    });

    var footer = mk("div");
    var submit = mk("button");
    submit.style.marginTop = "20px";
    submit.textContent = "Submit";
    submit.className = "btn btn-middle";
    footer.appendChild(submit);
    target.appendChild(footer);

    submit.addEventListener("click", submitPkgs);

    function submitPkgs(){

      var subPkgs = getPackages();
      var deps = {};
      subPkgs.forEach(function(el){
        deps[el.name] = el.version; 
      });
      $.ajax({
        type: 'POST',
        url: self.browserify + '/multi',
        // post payload:
        data: JSON.stringify({dependencies: deps}),
        contentType: 'application/json',
        success: function(data,textStatus,request){
          showHash(data.hash, deps);
        },
        error: function(callback){
          console.log(arguments);  
        }
      });
    }

    function getPackages(){
      return $(target).find( "input:checked" ).map(function(i,el){
        var pkg = self.pkgs[el.nId];
        return {name: pkg.name, version: pkg.version};
      });
    }

    function showHash(hash,dPkgs){
      var box = mk("div");

      var a = mk("a");
      a.href = self.browserify + "/multi/" + hash;
      a.textContent = "Download it ";

      box.appendChild(a);

      var span  = mk("span");

      console.log(dPkgs);

      var keys = Object.keys(dPkgs).map(function(el){
        return el + "(" + dPkgs[el] + ")";
      });
      span.textContent = keys.join(",");
      box.appendChild(span);

      target.appendChild(box);

      // scroll down and show the el
      window.scrollBy(0,100);
    }
  });
}

function mk(name){ return document.createElement(name);}

var target = document.getElementById('buildContainer');
new showOptions({el: target});
