module.exports = {
  theme: {
    screens: {
      sm: '360px',
      md: '560px',
      lg: '768px',
      xl: '960px',
      xxl: '1200px'
    },
    blockSpacing: {
      px: '1px',
      '0': '0',
      '1': '5px',
      '2': '10px',
      '3': '15px',
      '4': '20px',
      '5': '25px',
      '6': '30px',
      '7': '35px',
      '8': '40px',
      '9': '45px',
      '10': '50px',
      '14': '70px',
      '20': '100px',
      '30': '150px',
      '40': '200px',
      '-1': '-5px',
      '-2': '-10px',
      '-3': '-15px',
      '-4': '-20px',
      '-5': '-25px',
      '-6': '-30px',
      '-7': '-35px',
      '-8': '-40px',
      '-9': '-45px',
      '-10': '-50px',
      auto: 'auto'
    },
    spacing: {
      auto: 'auto',
      '1/12': '8.33333333%',
      '2/12': '16.66666667%',
      '3/12': '25%',
      '4/12': '33.33333333%',
      '5/12': '41.66666667%',
      '6/12': '50%',
      '7/12': '58.33333333%',
      '8/12': '66.66666667%',
      '9/12': '75%',
      '10/12': '83.33333333%',
      '11/12': '91.66666667%',
      '12/12': '100%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '5/5': '100%',
      '48%': '48%',
      '47%': '47%',
      full: '100%'
    },
    width: theme => ({
      ...theme('spacing'),
      screen: '100vw'
    }),
    height: theme => ({
      screen: '100vh',
      auto: 'auto',
      full: '100%'
    }),
    minHeight: theme => ({
      screen: '100vh',
      auto: 'auto'
    }),
    maxWidth: theme => ({
      ...theme('spacing'),
      screen: '100vw'
    }),
    minWidth: theme => ({
      ...theme('spacing'),
      screen: '100vw'
    }),
    margin: theme => ({
      ...theme('blockSpacing')
    }),
    padding: theme => ({
      ...theme('blockSpacing')
    }),
    extend: {
      colors: theme => ({
        'site-green': '#E4FAEF',
        'site-pink': '#FDF0F0',
        'site-orange': '#FEF2E2',
        'site-blue': '#E6F7FF'
      }),
      fontSize: theme => ({})
    }
  },
  variants: {
    borderWidth: ['responsive', 'last', 'hover', 'focus']
  },
  plugins: [],
  corePlugins: {
    container: false
  }
}
