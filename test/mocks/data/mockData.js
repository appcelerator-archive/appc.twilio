module.exports = {
  messages: require('./messages'),
  calls: require('./calls'),
  recordings: [],
  addresses: [
    {
      id: 1,
      sid: 'ADeeca6f73ab05629944633358ec84d413',
      customerName: 'Changed customer',
      street: '2 Hasselhoff Lane',
      city: 'NYC',
      region: 'Unknown',
      postalCode: '10013',
      isoCountry: 'US'
    },
    {
      id: 2,
      sid: 'ADea0177403a7d81e0792de7e50965831b',
      customerName: 'Changed customer',
      street: '2 Hasselhoff Lane',
      city: 'NYC',
      region: 'Unknown',
      postalCode: '10013',
      isoCountry: 'US'
    },
    {
      id: 3,
      sid: 'AD726771cbe8a6514e6f1e2e89266c5435',
      customerName: 'Changed customer',
      street: '2 Hasselhoff Lane',
      city: 'NYC',
      region: 'Unknown',
      postalCode: '10013',
      isoCountry: 'US'
    },
    {
      id: 4,
      sid: 'AD5201900aab7b2f7fd4113c2d4b731497',
      customerName: 'Changed customer',
      street: '2 Hasselhoff Lane',
      city: 'NYC',
      region: 'Unknown',
      postalCode: '10013',
      isoCountry: 'US'
    },
    {
      id: 5,
      sid: 'ADcdcac434b43abc34fb04372acccc217d',
      customerName: 'Changed customer',
      street: '2 Hasselhoff Lane',
      city: 'NYC',
      region: 'Unknown',
      postalCode: '10013',
      isoCountry: 'US'
    }
  ],
  query: {
    calls: [{
      where: {'status': 'busy'},
      value: [{
        sid: 'CA40ee01c2b34615655bc594c43b525ac2',
        date_created: 'Fri, 10 Feb 2017 13:49:21 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'busy',
        start_time: 'Fri, 10 Feb 2017 13:49:21 +0000',
        end_time: 'Fri, 10 Feb 2017 13:49:42 +0000',
        duration: '0',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA40ee01c2b34615655bc594c43b525ac2.json',
        subresource_uris: [Object]
      },
      {
        sid: 'CA767a95383048faf9818e622adae51677',
        date_created: 'Fri, 10 Feb 2017 13:43:12 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'busy',
        start_time: 'Fri, 10 Feb 2017 13:43:12 +0000',
        end_time: 'Fri, 10 Feb 2017 13:43:24 +0000',
        duration: '0',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA767a95383048faf9818e622adae51677.json',
        subresource_uris: [Object]
      }]}],
    adresses: []

  }
}
