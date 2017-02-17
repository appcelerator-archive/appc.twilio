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
      where: { 'status': 'busy' },
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
      }]
    },
    {
      where: { 'status': 'completed', 'to': '359899638562' },
      value: [{
        sid: 'CA6fc48b4ca48f7173231b90b87e9044f6',
        date_created: 'Tue, 31 Jan 2017 14:10:26 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'completed',
        start_time: 'Tue, 31 Jan 2017 14:10:43 +0000',
        end_time: 'Tue, 31 Jan 2017 14:10:55 +0000',
        duration: '12',
        price: '-0.40000',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA6fc48b4ca48f7173231b90b87e9044f6.json',
        subresource_uris: [Object]
      },
      {
        sid: 'CA6247d96e366c6bafe9e8cc173c4e085a',
        date_created: 'Thu, 26 Jan 2017 19:31:10 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'completed',
        start_time: 'Thu, 26 Jan 2017 19:31:20 +0000',
        end_time: 'Thu, 26 Jan 2017 19:31:28 +0000',
        duration: '8',
        price: '-0.40000',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA6247d96e366c6bafe9e8cc173c4e085a.json',
        subresource_uris: [Object]
      }]
    },
    {
      where: { 'to': '359271825' },
      value: []
    },
    {
      where: { 'startTime': '2017-01-31' },
      value: [{
        sid: 'CA82ab7668347d06f88453e7214608f221',
        date_created: 'Tue, 31 Jan 2017 14:32:03 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'busy',
        start_time: 'Tue, 31 Jan 2017 14:32:03 +0000',
        end_time: 'Tue, 31 Jan 2017 14:32:25 +0000',
        duration: '0',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA82ab7668347d06f88453e7214608f221.json',
        subresource_uris: [Object]
      },
      {
        sid: 'CA6fc48b4ca48f7173231b90b87e9044f6',
        date_created: 'Tue, 31 Jan 2017 14:10:26 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'completed',
        start_time: 'Tue, 31 Jan 2017 14:10:43 +0000',
        end_time: 'Tue, 31 Jan 2017 14:10:55 +0000',
        duration: '12',
        price: '-0.40000',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA6fc48b4ca48f7173231b90b87e9044f6.json',
        subresource_uris: [Object]
      }]
    },
    {
      where: {},
      value: [{
        sid: 'CA82ab7668347d06f88453e7214608f221',
        date_created: 'Tue, 31 Jan 2017 14:32:03 +0000',
        to: '+359899638562',
        from: '+16467625508',
        from_formatted: '(646) 762-5508',
        phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
        status: 'busy',
        start_time: 'Tue, 31 Jan 2017 14:32:03 +0000',
        end_time: 'Tue, 31 Jan 2017 14:32:25 +0000',
        duration: '0',
        price_unit: 'USD',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        caller_name: '',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA82ab7668347d06f88453e7214608f221.json',
        subresource_uris: [Object]
      }]
    }],
    messages: [{
      where: { 'to': '359899982932' },
      value: [{
        sid: 'SMdca3f9ade88b4870bbff6f2c38e8c7f1',
        date_created: 'Fri, 10 Feb 2017 13:31:56 +0000',
        date_updated: 'Fri, 10 Feb 2017 13:31:58 +0000',
        date_sent: 'Fri, 10 Feb 2017 13:31:56 +0000',
        account_sid: 'AC87eb3a123eb2b04f0d0d0a4ed18654f9',
        to: '+359899982932',
        from: '+16467625508',
        body: 'trial',
        status: 'delivered',
        num_segments: '1',
        num_media: '0',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        price: '-0.13000',
        price_unit: 'USD',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SMdca3f9ade88b4870bbff6f2c38e8c7f1.json',
        subresource_uris: [Object]
      },
      {
        sid: 'SMa295b72c53c148f987ea0a98d990fa91',
        date_created: 'Wed, 08 Feb 2017 14:03:51 +0000',
        date_updated: 'Wed, 08 Feb 2017 14:03:56 +0000',
        date_sent: 'Wed, 08 Feb 2017 14:03:51 +0000',
        account_sid: 'AC87eb3a123eb2b04f0d0d0a4ed18654f9',
        to: '+359899982932',
        from: '+16467625508',
        body: 'trial',
        status: 'delivered',
        num_segments: '1',
        num_media: '0',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        price: '-0.13000',
        price_unit: 'USD',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SMa295b72c53c148f987ea0a98d990fa91.json',
        subresource_uris: [Object]
      }]
    },
    {
      where: { 'to': '359899982932', 'DateSent': 'Thu, 26 Jan 2017' },
      value: [{
        sid: 'SM998f7c270098420b82fd7c2c32fe2832',
        date_created: 'Thu, 26 Jan 2017 08:37:39 +0000',
        date_updated: 'Thu, 26 Jan 2017 08:37:41 +0000',
        date_sent: 'Thu, 26 Jan 2017 08:37:39 +0000',
        account_sid: 'AC87eb3a123eb2b04f0d0d0a4ed18654f9',
        to: '+359899982932',
        from: '+16467625508',
        body: 'Test SMS',
        status: 'delivered',
        num_segments: '1',
        num_media: '0',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        price: '-0.13000',
        price_unit: 'USD',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SM998f7c270098420b82fd7c2c32fe2832.json',
        subresource_uris: [Object]
      },
      {
        sid: 'SM2b956feb1bb74273b9e87bb0c1e5ecfa',
        date_created: 'Thu, 26 Jan 2017 08:37:37 +0000',
        date_updated: 'Thu, 26 Jan 2017 08:37:40 +0000',
        date_sent: 'Thu, 26 Jan 2017 08:37:37 +0000',
        account_sid: 'AC87eb3a123eb2b04f0d0d0a4ed18654f9',
        to: '+359899982932',
        from: '+16467625508',
        body: 'Test SMS',
        status: 'delivered',
        num_segments: '1',
        num_media: '0',
        direction: 'outbound-api',
        api_version: '2010-04-01',
        price: '-0.13000',
        price_unit: 'USD',
        uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SM2b956feb1bb74273b9e87bb0c1e5ecfa.json',
        subresource_uris: [Object]
      }]
    }],
    addresses: [
      {
        where: { 'friendlyName': 'The Simpsons' },
        value: [{
          sid: 'AD4b5123da3d903e0e3f433e775c737725',
          friendlyName: 'The Simpsons',
          customerName: 'Homer Simpson',
          street: 'Evergreen Terace 47',
          city: 'Springfield',
          region: 'CA',
          postalCode: '1234',
          isoCountry: 'US'
        }]
      },
      {
        where: { 'friendlyName': 'The Simpsons', 'customerName': 'Homer' },
        value: []
      }
    ],
    outgoingCallerIds: [
      {
        where: { 'phoneNumber': '16467625508' },
        value: []
      }]
  },
  findByID: {
    messages: [{
      sid: 'SM998f7c270098420b82fd7c2c32fe2832',
      date_created: 'Thu, 26 Jan 2017 08:37:39 +0000',
      date_updated: 'Thu, 26 Jan 2017 08:37:41 +0000',
      date_sent: 'Thu, 26 Jan 2017 08:37:39 +0000',
      account_sid: 'AC87eb3a123eb2b04f0d0d0a4ed18654f9',
      to: '+359899982932',
      from: '+16467625508',
      body: 'Test SMS',
      status: 'delivered',
      num_segments: '1',
      num_media: '0',
      direction: 'outbound-api',
      api_version: '2010-04-01',
      price: '-0.13000',
      price_unit: 'USD',
      uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SM998f7c270098420b82fd7c2c32fe2832.json',
      subresource_uris: { media: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Messages/SM998f7c270098420b82fd7c2c32fe2832/Media.json' }
    }],
    calls: [{
      sid: 'CA8a3f92d936e485725f08b67a37bbcf89',
      date_created: 'Tue, 31 Jan 2017 13:14:28 +0000',
      to: '+359899638562',
      from: '+16467625508',
      from_formatted: '(646) 762-5508',
      phone_number_sid: 'PNf52c5c5b1c07228018e1d664821ebadd',
      status: 'busy',
      start_time: 'Tue, 31 Jan 2017 13:14:28 +0000',
      end_time: 'Tue, 31 Jan 2017 13:15:02 +0000',
      duration: '0',
      price_unit: 'USD',
      direction: 'outbound-api',
      api_version: '2010-04-01',
      caller_name: '',
      uri: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA8a3f92d936e485725f08b67a37bbcf89.json',
      subresource_uris:
      {
        notifications: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA8a3f92d936e485725f08b67a37bbcf89/Notifications.json',
        recordings: '/2010-04-01/Accounts/AC87eb3a123eb2b04f0d0d0a4ed18654f9/Calls/CA8a3f92d936e485725f08b67a37bbcf89/Recordings.json'
      }
    }]
  }
}
