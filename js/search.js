// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const query = searchInput.value.trim().toLowerCase();
      
      // Define mapping of keywords to calculator pages
      const calculatorMap = {
        'body': 'pages/body-type.html',
        'body type': 'pages/body-type.html',
        'bmi': 'pages/body-type.html',
        'weight': 'pages/body-type.html',
        
        'period': 'pages/period.html',
        'menstrual': 'pages/period.html',
        'cycle': 'pages/menstrual-cycle.html',
        'menstrual cycle': 'pages/menstrual-cycle.html',
        
        'bra': 'pages/bra-size.html',
        'bra size': 'pages/bra-size.html',
        
        'bsa': 'pages/bsa.html',
        'body surface': 'pages/bsa.html',
        'body surface area': 'pages/bsa.html',
        
        'protein': 'pages/protein-intake.html',
        'protein intake': 'pages/protein-intake.html',
        
        'fuel': 'pages/fuel.html',
        'gas': 'pages/fuel.html',
        'petrol': 'pages/fuel.html',
        
        'birthday': 'pages/birthday-calendar.html',
        'calendar': 'pages/birthday-calendar.html',
        
        'body shape': 'pages/body-shape.html',
        'shape': 'pages/body-shape.html',
        
        'conversion': 'pages/conversion-table.html',
        'convert': 'pages/conversion-table.html',
        'table': 'pages/conversion-table.html',
        
        'tyre': 'pages/tyre-size.html',
        'tire': 'pages/tyre-size.html',
        'wheel': 'pages/tyre-size.html',
        
        'electricity': 'pages/electricity-unit.html',
        'electricity unit': 'pages/electricity-unit.html',
        'electricity consumption': 'pages/electricity-consumption.html',
        'power': 'pages/electricity-consumption.html'
      };
      
      // Search for matches
      for (const keyword in calculatorMap) {
        if (query.includes(keyword)) {
          window.location.href = calculatorMap[keyword];
          return;
        }
      }
      
      // If no specific match, go to generic search results
      if (query) {
        // For demo purposes, just go to index page with a search param
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
});