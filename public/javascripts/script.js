const directionsService = new google.maps.DirectionsService;
const directionsDisplay = new google.maps.DirectionsRenderer;
const stores = [{"address": "Alameda Jaú", "number":    "1301",   "zipCode": "01420-001", "neighborhood": "Jardim Paulista",  "city": "São Paulo", "UF":"SP", "location": [-46.660037, -23.561413]},
{"address": "Av. Paulista", "number": "2034", "zipCode": "01310-200", "neighborhood": "Bela Vista", "city":   "São Paulo", "UF": "SP", "location": [ -46.659207, -23.558786]},
{"address": "R. Augusta",   "number": "1856",   "zipCode": "01412-000", "neighborhood": "Cerqueira César", "city": "São Paulo", "UF":   "SP", "location": [ -46.661215, -23.558499]},
{"address": "R. Pamplona",  "number": "734", "zipCode": "01405-001", "neighborhood": "Jardim Paulista", "city": "São Paulo", "UF": "SP", "location": [-46.654733, 23.563995]},
{"address": "Av. Goiás",   "number": "1805",   "zipCode": "09550-050", "neighborhood": "Santa Paula", "city":    "São Caetano do Sul", "UF": "SP", "location": [-46.558175, -23.616071]},
{"address": "R. Mal. Deodoro",  "number": "1322",   "zipCode": "09710-002", "neighborhood": "Centro", "city": "São Bernardo do Campo", "UF": "SP", "location": [-46.551135, -23.709453]},
{"address": "R. Aurora Soares Barbosa", "number": "775", "zipCode":   "06023-010",  "neighborhood": "Vila Campesina", "city": "Osasco", "UF": "SP", "location": [-46.772313, -23.542416]},
{"address": "R.Waldir de Azevedo",  "number": "20", "zipCode": "07122-170", "neighborhood": "Jardim Bom Clima", "city":   "Guarulhos",  "UF": "SP", "location": [-46.520487, -23.449064]},
{"address": "R. Sebastião Pereira",    "number": "245",    "zipCode": "01225-020", "neighborhood": "Vila Buarque", "city":   "São Paulo", "UF": "SP", "location": [-46.648989, -23.539394]},
{"address": "Av. Rui Barbosa",  "number": "409", "zipCode": "06311-000", "neighborhood":  "Vila Caldas", "city":  "Carapicuíba", "UF": "SP", "location": [-46.834463, -23.520650]},
{"address": "Av. Antônio Piranga", "number": "171",    "zipCode": "09911-160", "neighborhood":   "Centro", "city": "Diadema", "UF":  "SP", "location": [-46.622696, -23.685897]},
{"address": "Av. Vital Brasil", "number": "1133", "zipCode": "05503-001", "neighborhood": "Butantã",   "city": "São Paulo", "UF": "SP", "location": [-46.715018, -23.569207]},
{"address": "Av. Alcântara Machado", "number": "576", "zipCode": "03102-000", "neighborhood":    "Brás", "city": "São Paulo", "UF": "SP", "location": [-46.619414, -23.552799]},
{"address": "Av. Imirim",   "number": "1217", "zipCode":  "02465-100",  "neighborhood": "Imirim", "city": "São Paulo", "UF": "SP", "location": [-46.646239, -23.494115]},
{"address": "Av. Roque Petroni Júnior",    "number": "1089",   "zipCode": "04707-000", "neighborhood":   "Jardim das Acácias",    "city": "São Paulo", "UF": "SP", "location": [-46.698717,-23.622961]}]

console.log(stores)

const startMap = () => {
  const markers = [];

  const consolacao = {
  	lat: -23.5607694,
    lng: -46.6518032,
  };
  let map = new google.maps.Map(
    document.getElementById('maps'),
    {
      zoom: 15,
      center: consolacao,
    },
  );

  // const getLocations = () => {
  //   if (document.URL.length < 23) {
  //     axios.get('/api/locations')
  //       .then((response) => {
  //         placeLocations(response.data.places);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     const id = document.URL.slice(document.URL.length - 24);
  //     axios.get('/api/locations/' + id)
  //       .then((response) => {
  //         placeLocations([response.data.location]);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }; 
  stores.forEach((store) => {
    console.log(typeof store.location[1])
      const pin = new google.maps.Marker({
        position: {
          lat: store.location[1],
          lng: store.location[0]
        },
        map: map,
        title: 'Superfood',
      });
      markers.push(pin);
  })
  console.log()
  // const placeLocations = (store) => {
  //   store.forEach((store) => {
  //     // console.log(location.location);
  //     console.log(store)
  //     if (location.location) {
  //       const center = {
  //         lat: location.location.coordinates[0],
  //         lng: location.location.coordinates[1],
  //       };
  //       const pin = new google.maps.Marker({
  //         position: center,
  //         map,
  //         title: location.name,
  //       });
  //       markers.push(pin);
  //     }
  //   });
  // };

  // getLocations();
}

startMap();