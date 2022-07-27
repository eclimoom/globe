const labelsTopOrientation = new Set(["Apollo 12", "Luna 2", "Luna 20", "Luna 21", "Luna 24", "LCROSS Probe"]); // avoid label collisions
const elem = document.getElementById("globeViz");
const moon = Globe()
  .globeImageUrl("./images/earth-medium.jpg")
  .bumpImageUrl("./images/earth-topology.png")
  .backgroundImageUrl("./images/night-sky.png")
  .showGraticules(true)
  .showAtmosphere(true) // moon has no atmosphere
  .labelText("label")
  .labelSize(2)
  .labelDotRadius(0.5)
  .labelDotOrientation((d) => (labelsTopOrientation.has(d.label) ? "top" : "bottom"))
  .labelLabel(
    (d) =>
      `
        <div><b>${d.label}</b></div>
        <div>${d.agency} - ${d.program} Program</div>
        <div>Landing on <i>${new Date(d.date).toLocaleDateString()}</i></div>
      `
  )
  .onLabelHover((d) => (moon.controls().autoRotate = false))
  .onLabelClick((d) => {
    console.log(d);
    //  window.open(d.url, "_blank");
  }
  )(elem);

fetch("./labels.json") // make the request to fetch https://raw.githubusercontent.com/eesur/country-codes-lat-long/e20f140202afbb65addc13cad120302db26f119a/country-codes-lat-long-alpha3.json
  // fetch('https://raw.githubusercontent.com/eesur/country-codes-lat-long/e20f140202afbb65addc13cad120302db26f119a/country-codes-lat-long-alpha3.json')
  .then((r) => r.json()) //then get the returned json request header if and when the request value returns true
  .then((landingSites) => {
    // then use the request result as a callback
    console.log(landingSites);
    // moon.labelsData(landingSites.ref_country_codes);
    moon.labelsData(landingSites);
    // console.log(moon.labelLabel);

    // custom globe material
    const globeMaterial = moon.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load("./images/earth-water.png", (texture) => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color("grey");
      globeMaterial.shininess = 15;
    });
  });

moon.controls().autoRotate = true;
moon.controls().autoRotateSpeed = 0.8;

