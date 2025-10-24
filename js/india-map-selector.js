/**
 * India Map Selector
 * Interactive map for selecting Indian states and districts
 * Based on D3.js and TopoJSON
 */

class IndiaMapSelector {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 600,
            height: options.height || 600,
            onStateSelect: options.onStateSelect || (() => {}),
            onDistrictSelect: options.onDistrictSelect || (() => {}),
            ...options
        };
        
        this.selectedState = null;
        this.selectedDistrict = null;
        this.currentView = 'india'; // 'india' or 'state'
        
        // Western Capital operational states and their branches with addresses
        this.branchAddresses = {
            'Rajasthan': {
                'Ajmer': 'Shop No. 201-202, Second Floor, Rajdarshan Complex, Near Old Power House, Jaipur Road, Ajmer, Rajasthan - 305001',
                'Chittorgarh': 'First Floor, Shop No. 5, Opposite Collector Office, Station Road, Chittorgarh, Rajasthan - 312001',
                'Chomu': 'Shop No. 15-16, First Floor, Shree Ram Complex, Jaipur Road, Chomu, Rajasthan - 303702',
                'Fatehnagar': 'Khasra No. 287, Village Fatehnagar, Udaipur, Rajasthan - 313205',
                'Gulabpura': 'Shop No. 1, Pehli Manzil, Krishna Complex, Bhilwara Road, Gulabpura, Rajasthan - 311021',
                'Jhunjhunu': 'Shop No. 201-202, Second Floor, Opposite SBI Bank, Main Market, Jhunjhunu, Rajasthan - 333001',
                'Beawar': 'Shop No. 302, Third Floor, Above Bank of Baroda, Ajmer Road, Beawar, Rajasthan - 305901',
                'Kotputli': 'Shop No. 201, Second Floor, Near Bus Stand, Jaipur Road, Kotputli, Rajasthan - 303108',
                'Rajsamand': 'Shop No. 7-8, First Floor, Near Circuit House, NH 8, Rajsamand, Rajasthan - 313326',
                'Kuchaman': 'Shop No. 12, Second Floor, Station Road, Kuchaman City, Rajasthan - 341508',
                'Sojat': 'Shop No. 15, First Floor, Near ICICI Bank, Pali Road, Sojat City, Rajasthan - 306104',
                'Neem Ka Thana': 'Shop No. 201, Second Floor, Sikar Road, Neem Ka Thana, Rajasthan - 332713',
                'Sujangarh': 'Shop No. 19, Second Floor, Near SBI, Station Road, Sujangarh, Rajasthan - 331507',
                'Jaipur': 'Shop No. 301-302, Third Floor, Kalyan Complex, MI Road, Jaipur, Rajasthan - 302001',
                'Sikar': 'Shop No. 201, Second Floor, Near Government Hospital, Jaipur Road, Sikar, Rajasthan - 332001',
                'Kekri': 'Shop No. 5, First Floor, Near Bus Stand, Ajmer Road, Kekri, Rajasthan - 305404',
                'Nimbahera': 'Shop No. 8, First Floor, Near ICICI Bank, Station Road, Nimbahera, Rajasthan - 312601',
                'Udaipur': 'Shop No. 401-402, Fourth Floor, Near Clock Tower, City Centre, Udaipur, Rajasthan - 313001',
                'Sumerpur': 'Shop No. 10, First Floor, Pali Road, Sumerpur, Rajasthan - 306902',
                'Ratangarh': 'Shop No. 15, Second Floor, Main Market, Ratangarh, Rajasthan - 331022',
                'Nokha': 'Shop No. 7, First Floor, Bikaner Road, Nokha, Rajasthan - 334803',
                'Phalodi': 'Shop No. 12, First Floor, Station Road, Phalodi, Rajasthan - 342301'
            },
            'Maharashtra': {
                'Akola': 'Shop No. 301, Third Floor, Rajkamal Square, Civil Lines, Akola, Maharashtra - 444001',
                'Baramati': 'Shop No. 15-16, First Floor, Near ST Stand, Pune Road, Baramati, Maharashtra - 413102',
                'Dhule': 'Shop No. 201, Second Floor, Kukreja Plaza, Agra Road, Dhule, Maharashtra - 424001',
                'Buldhana': 'Shop No. 12, First Floor, Main Road, Near Bank of Maharashtra, Buldhana - 443001',
                'Karad': 'Shop No. 8, Second Floor, Pune Bangalore Highway, Karad, Maharashtra - 415110',
                'Nagpur': 'Shop No. 501, Fifth Floor, Kailash Towers, South Ambazari Road, Nagpur - 440010',
                'Jalgaon': 'Shop No. 201-202, Second Floor, M.G. Road, Jalgaon, Maharashtra - 425001',
                'Kalyan': 'Shop No. 301, Third Floor, Bhimnagar, Near Railway Station, Kalyan West - 421301',
                'Kolhapur': 'Shop No. 15, Second Floor, Station Road, Near ST Stand, Kolhapur - 416012',
                'Nashik': 'Shop No. 401, Fourth Floor, Suyojit Sankul, Sharanpur Road, Nashik - 422002',
                'Pune': 'Shop No. 501, Fifth Floor, Dhananjay Tower, Shivaji Nagar, Pune - 411005',
                'Sangli': 'Shop No. 201, Second Floor, Miraj Road, Near Market Yard, Sangli - 416416',
                'Satara': 'Shop No. 301, Third Floor, Powai Naka, Satara, Maharashtra - 415002',
                'Yavatmal': 'Shop No. 12, First Floor, Main Road, Yavatmal, Maharashtra - 445001',
                'Sangamner': 'Shop No. 8, First Floor, Nagar Manmad Road, Sangamner, Maharashtra - 422605',
                'HO - Maharashtra ISD': 'Head Office, 4th Floor, Trade Centre, Bandra Kurla Complex, Mumbai - 400051',
                'OPS HUB - Maharashtra ISD': 'Operations Hub, 3rd Floor, IT Park, Hinjewadi, Pune - 411057'
            },
            'Madhya Pradesh': {
                'Dewas': 'Shop No. 201, Second Floor, Near Old Palasia, Dewas, Madhya Pradesh - 455001',
                'Dhamnod': 'Shop No. 5, First Floor, Ratlam Road, Dhamnod, Madhya Pradesh - 457335',
                'Indore': 'Shop No. 501-502, Fifth Floor, Amar Plaza, M.G. Road, Indore - 452001',
                'Khargone': 'Shop No. 15, Second Floor, Main Road, Khargone, Madhya Pradesh - 451001',
                'Jaora': 'Shop No. 8, First Floor, Ratlam Road, Jaora, Madhya Pradesh - 457226',
                'Sehore': 'Shop No. 201, Second Floor, Ashta Road, Sehore, Madhya Pradesh - 466001',
                'Ujjain': 'Shop No. 301, Third Floor, Freeganj, Ujjain, Madhya Pradesh - 456010',
                'Hoshangabad': 'Shop No. 12, First Floor, Harda Road, Hoshangabad, Madhya Pradesh - 461001',
                'Mandsaur': 'Shop No. 201, Second Floor, Gandhi Chowk, Mandsaur, Madhya Pradesh - 458001',
                'Shamgarh': 'Shop No. 7, First Floor, Main Market, Shamgarh, Madhya Pradesh - 458883',
                'Manasa': 'Shop No. 5, First Floor, Near Bus Stand, Manasa, Madhya Pradesh - 455001',
                'Shujalpur': 'Shop No. 10, Second Floor, Shajapur Road, Shujalpur, Madhya Pradesh - 465333',
                'Khandwa': 'Shop No. 301, Third Floor, Near Railway Station, Khandwa, Madhya Pradesh - 450001',
                'Khategaon': 'Shop No. 8, First Floor, Dewas Road, Khategaon, Madhya Pradesh - 455336'
            },
            'Tamil Nadu': {
                'Nagarcoil': 'Shop No. 301, Third Floor, Vetri Towers, NSK Road, Nagercoil - 629001',
                'Madurai': 'Shop No. 401, Fourth Floor, TPK Road, Near Railway Station, Madurai - 625003',
                'Theni': 'Shop No. 201, Second Floor, Periyakulam Road, Theni, Tamil Nadu - 625531',
                'Tirunelveli': 'Shop No. 301, Third Floor, Trivandrum Road, Tirunelveli - 627001',
                'Sivakasi': 'Shop No. 15, Second Floor, Near New Bus Stand, Sivakasi - 626123',
                'Thoothukudi': 'Shop No. 201, Second Floor, Palayamkottai Road, Thoothukudi - 628002',
                'Karaikudi': 'Shop No. 12, First Floor, Devakottai Road, Karaikudi, Tamil Nadu - 630001',
                'Namakkal': 'Shop No. 201, Second Floor, Salem Main Road, Namakkal, Tamil Nadu - 637001',
                'Salem': 'Shop No. 401, Fourth Floor, Cherry Road, Salem, Tamil Nadu - 636007',
                'Krishnagiri': 'Shop No. 301, Third Floor, Bangalore Road, Krishnagiri - 635001',
                'Erode': 'Shop No. 201, Second Floor, Perundurai Road, Erode, Tamil Nadu - 638001',
                'Viluppuram': 'Shop No. 15, First Floor, Cuddalore Main Road, Viluppuram - 605602',
                'Kallakurichi': 'Shop No. 8, First Floor, Ulundurpet Road, Kallakurichi - 606213',
                'Dharmapuri': 'Shop No. 201, Second Floor, Salem Main Road, Dharmapuri - 636701'
            },
            'Telangana': {
                'Medchal': 'Shop No. 301, Third Floor, Near Bus Depot, Kompally, Medchal - 501401',
                'Ibrahimpatnam': 'Shop No. 15, First Floor, Main Road, Ibrahimpatnam, Ranga Reddy - 501506',
                'Siddipet': 'Shop No. 201, Second Floor, Hyderabad Road, Siddipet, Telangana - 502103',
                'Jangaon': 'Shop No. 12, First Floor, Main Road, Jangaon, Telangana - 506167',
                'Kamareddy': 'Shop No. 201, Second Floor, Near Bus Stand, Kamareddy - 503111',
                'Jagtial': 'Shop No. 15, First Floor, Main Road, Jagtial, Telangana - 505327',
                'Karimnagar': 'Shop No. 301, Third Floor, Rajeev Chowk, Karimnagar - 505001'
            },
            'Karnataka': {
                'Belgaum': 'Shop No. 401, Fourth Floor, Hindwadi, Belgaum, Karnataka - 590011',
                'Davanagere': 'Shop No. 201, Second Floor, P.J. Extension, Davanagere - 577002',
                'Haveri': 'Shop No. 15, First Floor, Ranibennur Road, Haveri, Karnataka - 581110',
                'Chitradurga': 'Shop No. 201, Second Floor, Near Court Circle, Chitradurga - 577501',
                'Hospet': 'Shop No. 301, Third Floor, Station Road, Hospet, Karnataka - 583201',
                'Shimoga': 'Shop No. 201, Second Floor, Kuvempu Road, Shimoga, Karnataka - 577201',
                'Gadag': 'Shop No. 12, First Floor, Station Road, Gadag, Karnataka - 582101'
            }
        };
        
        // Create simplified branch lists for state selection
        this.operationalStates = {};
        Object.keys(this.branchAddresses).forEach(state => {
            this.operationalStates[state] = Object.keys(this.branchAddresses[state]);
        });
        
        this.init();
    }
    
    async init() {
        // Show loading message
        this.container.innerHTML = '<div style="text-align: center; padding: 50px; color: #02478c; font-size: 18px;">Loading interactive map...</div>';
        
        // Create SVG container
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', this.options.height)
            .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background', '#f0f8ff');
            
        this.mapGroup = this.svg.append('g');
        
        // Create tooltip
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'india-map-tooltip')
            .style('position', 'absolute')
            .style('display', 'none')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px 12px')
            .style('border-radius', '4px')
            .style('font-size', '14px')
            .style('pointer-events', 'none')
            .style('z-index', '9999');
            
        // Create back button (hidden initially)
        this.backButton = d3.select(this.container)
            .append('button')
            .attr('class', 'map-back-button')
            .style('display', 'none')
            .style('position', 'absolute')
            .style('top', '10px')
            .style('left', '10px')
            .style('padding', '8px 16px')
            .style('background', '#02478c')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '4px')
            .style('cursor', 'pointer')
            .style('font-size', '14px')
            .style('z-index', '10')
            .text('← Back to India Map')
            .on('click', () => this.showIndiaMap());
        
        // Load and display India map
        await this.loadIndiaMap();
    }
    
    async loadIndiaMap() {
        try {
            const response = await fetch('/js/topojsons/india.json');
            if (!response.ok) {
                throw new Error(`Failed to load India map: ${response.statusText}`);
            }
            const topology = await response.json();
            
            // Convert TopoJSON to GeoJSON - use correct object name
            const geojson = topojson.feature(topology, topology.objects['India-States']);
            
            // Create projection
            const projection = d3.geoMercator()
                .fitSize([this.options.width, this.options.height], geojson);
            
            const path = d3.geoPath().projection(projection);
            
            // Clear existing paths
            this.mapGroup.selectAll('*').remove();
            
            // Draw states
            this.mapGroup.selectAll('path')
                .data(geojson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    const isOperational = this.operationalStates.hasOwnProperty(stateName);
                    return isOperational ? '#4CAF50' : '#cccccc'; // Green for operational, gray for non-operational
                })
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1.5)
                .style('cursor', (d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    const isOperational = this.operationalStates.hasOwnProperty(stateName);
                    return isOperational ? 'pointer' : 'not-allowed';
                })
                .style('transition', 'all 0.3s ease')
                .attr('data-state', (d) => d.properties.ST_NM || d.properties.NAME_1 || 'Unknown')
                .on('mouseover', (event, d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    const isOperational = this.operationalStates.hasOwnProperty(stateName);
                    
                    if (isOperational) {
                        d3.select(event.currentTarget)
                            .transition()
                            .duration(200)
                            .attr('fill', '#ff8a00')
                            .attr('stroke-width', 2);
                        
                        // Animate corresponding label
                        this.mapGroup.selectAll('text')
                            .filter(function() {
                                return d3.select(this).text() === stateName;
                            })
                            .transition()
                            .duration(200)
                            .style('font-size', '14px')
                            .style('fill', '#ffffff');
                        
                        const branchCount = this.operationalStates[stateName].length;
                        this.tooltip
                            .style('display', 'block')
                            .html(`<strong>${stateName}</strong><br/>${branchCount} branches available<br/><small>Click to view branches</small>`);
                    } else {
                        d3.select(event.currentTarget)
                            .transition()
                            .duration(200)
                            .attr('fill', '#999999');
                        
                        this.tooltip
                            .style('display', 'block')
                            .html(`<strong>${stateName}</strong><br/><small style="color: #ff8a00;">No branches available</small>`);
                    }
                })
                .on('mousemove', (event) => {
                    this.tooltip
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 20) + 'px');
                })
                .on('mouseout', (event, d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    const isOperational = this.operationalStates.hasOwnProperty(stateName);
                    
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('fill', isOperational ? '#4CAF50' : '#cccccc')
                        .attr('stroke-width', 1.5);
                    
                    // Reset corresponding label
                    this.mapGroup.selectAll('text')
                        .filter(function() {
                            return d3.select(this).text() === stateName;
                        })
                        .transition()
                        .duration(200)
                        .style('font-size', '12px')
                        .style('fill', '#ffffff');
                    
                    this.tooltip.style('display', 'none');
                })
                .on('click', (event, d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    const isOperational = this.operationalStates.hasOwnProperty(stateName);
                    
                    if (isOperational) {
                        this.selectState(stateName);
                    }
                });
            
            // Add state name labels for operational states with proper positioning
            const labelOffsets = {
                'Rajasthan': { dx: 0, dy: 0 },
                'Maharashtra': { dx: 0, dy: 20 },
                'Madhya Pradesh': { dx: 0, dy: 0 },
                'Tamil Nadu': { dx: 0, dy: 10 },
                'Telangana': { dx: 0, dy: 0 },
                'Karnataka': { dx: 0, dy: 15 }
            };
            
            this.mapGroup.selectAll('text')
                .data(geojson.features.filter(d => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    return this.operationalStates.hasOwnProperty(stateName);
                }))
                .enter()
                .append('text')
                .attr('x', d => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1;
                    const offset = labelOffsets[stateName] || { dx: 0, dy: 0 };
                    return path.centroid(d)[0] + offset.dx;
                })
                .attr('y', d => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1;
                    const offset = labelOffsets[stateName] || { dx: 0, dy: 0 };
                    return path.centroid(d)[1] + offset.dy;
                })
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('class', 'state-label')
                .style('font-size', '11px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 3px rgba(0,0,0,0.8), 1px -1px 3px rgba(0,0,0,0.8), -1px 1px 3px rgba(0,0,0,0.8)')
                .style('pointer-events', 'none')
                .style('opacity', 0)
                .style('letter-spacing', '0.5px')
                .text(d => d.properties.ST_NM || d.properties.NAME_1)
                .transition()
                .duration(800)
                .delay((d, i) => i * 100)
                .style('opacity', 0.95);
            
            // Add pin icons for operational states
            const pinOffsets = {
                'Rajasthan': { dx: 0, dy: -25 },
                'Maharashtra': { dx: 0, dy: -5 },
                'Madhya Pradesh': { dx: 0, dy: -25 },
                'Tamil Nadu': { dx: 0, dy: -15 },
                'Telangana': { dx: 0, dy: -25 },
                'Karnataka': { dx: 0, dy: -10 }
            };
            
            this.mapGroup.selectAll('.state-pin')
                .data(geojson.features.filter(d => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    return this.operationalStates.hasOwnProperty(stateName);
                }))
                .enter()
                .append('g')
                .attr('class', 'state-pin')
                .attr('transform', d => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1;
                    const offset = pinOffsets[stateName] || { dx: 0, dy: -20 };
                    const centroid = path.centroid(d);
                    return `translate(${centroid[0] + offset.dx}, ${centroid[1] + offset.dy})`;
                })
                .style('opacity', 0)
                .each(function() {
                    const pinGroup = d3.select(this);
                    
                    // Use your custom pin image
                    pinGroup.append('image')
                        .attr('href', '/generated-image-removebg-preview.png')
                        .attr('x', -8)
                        .attr('y', -8)
                        .attr('width', 16)
                        .attr('height', 16)
                        .attr('opacity', 0.9);
                })
                .transition()
                .duration(1000)
                .delay((d, i) => i * 150 + 200)
                .style('opacity', 0.9);
            
            this.currentView = 'india';
            this.backButton.style('display', 'none');
            
        } catch (error) {
            console.error('Error loading India map:', error);
            this.container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="color: #d32f2f; font-size: 18px; margin-bottom: 15px;">
                        ⚠️ Unable to load map
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        ${error.message || 'Please refresh the page to try again.'}
                    </p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #02478c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
    
    async selectState(stateName) {
        // Reset previous selection highlighting
        this.mapGroup.selectAll('path')
            .transition()
            .duration(300)
            .attr('fill', (d) => {
                const state = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                const isOperational = this.operationalStates.hasOwnProperty(state);
                return isOperational ? '#4CAF50' : '#cccccc';
            });
        
        // Reset pin highlighting
        this.mapGroup.selectAll('.state-pin')
            .transition()
            .duration(300)
            .style('transform', 'scale(1)')
            .selectAll('image')
            .transition()
            .duration(300)
            .style('filter', 'none');
        
        // Highlight selected state in red
        this.mapGroup.selectAll('path')
            .filter(function() {
                const state = d3.select(this).attr('data-state');
                return state === stateName;
            })
            .transition()
            .duration(300)
            .attr('fill', '#ff4444')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 3);
        
        // Highlight selected state's pin
        this.mapGroup.selectAll('.state-pin')
            .each(function(d) {
                const pinState = d.properties.ST_NM || d.properties.NAME_1;
                if (pinState === stateName) {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style('transform', 'scale(1.2)')
                        .selectAll('image')
                        .transition()
                        .duration(300)
                        .style('filter', 'hue-rotate(0deg) brightness(1.2)');
                }
            });
        
        this.selectedState = stateName;
        this.options.onStateSelect(stateName);
        
        // Don't show branch list overlay - let the right panel handle it
    }
    
    showBranchList(stateName) {
        const branches = this.operationalStates[stateName];
        
        // Clear the map
        this.mapGroup.selectAll('*').remove();
        
        // Create enhanced branch selection interface
        const foreignObject = this.svg.append('foreignObject')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('x', 0)
            .attr('y', 0);
        
        const branchHTML = `
            <div style="padding: 20px; height: ${this.options.height}px; overflow-y: auto; overflow-x: hidden; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 30%); font-family: Arial, sans-serif; box-sizing: border-box; -webkit-overflow-scrolling: touch;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <h3 style="color: #02478c; margin: 0 0 10px 0; font-size: 26px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                        <span style="display: inline-block; padding: 10px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(2,71,140,0.2);">
                            📍 ${stateName}
                        </span>
                    </h3>
                    <p style="color: #555; margin: 15px 0 0 0; font-size: 15px;">
                        <strong style="color: #4CAF50;">${branches.length}</strong> branches available • Select your nearest location
                    </p>
                </div>
                
                <!-- Search Box -->
                <div style="margin-bottom: 20px; text-align: center;">
                    <input 
                        type="text" 
                        id="branch-search" 
                        placeholder="🔍 Search by branch name..."
                        onkeyup="window.indiaMapSelectorInstance.filterBranches(this.value)"
                        style="
                            width: 100%;
                            max-width: 400px;
                            padding: 12px 20px;
                            font-size: 15px;
                            border: 2px solid #4CAF50;
                            border-radius: 25px;
                            outline: none;
                            box-shadow: 0 2px 10px rgba(76, 175, 80, 0.2);
                            transition: all 0.3s ease;
                        "
                        onfocus="this.style.boxShadow='0 4px 20px rgba(76, 175, 80, 0.4)'; this.style.borderColor='#02478c';"
                        onblur="this.style.boxShadow='0 2px 10px rgba(76, 175, 80, 0.2)'; this.style.borderColor='#4CAF50';"
                    />
                </div>
                
                <!-- Branch Count Info -->
                <div id="branch-count-info" style="text-align: center; margin-bottom: 15px; font-size: 14px; color: #666; min-height: 20px;">
                    Showing all ${branches.length} branches
                </div>
                
                <!-- Branch Cards Grid -->
                <div id="branch-grid" style="
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
                    gap: 15px; 
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    animation: fadeIn 0.5s ease-in;
                ">
                    ${branches.map((branch, index) => `
                        <div 
                            class="branch-card"
                            data-branch-name="${branch.toLowerCase()}"
                            onclick="window.indiaMapSelectorInstance.selectBranch('${stateName}', '${branch}')"
                            style="
                                padding: 20px 15px;
                                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                                border: 2px solid #e0e0e0;
                                border-radius: 12px;
                                cursor: pointer;
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                                text-align: center;
                                position: relative;
                                overflow: hidden;
                                animation: slideUp 0.5s ease-out ${index * 0.03}s both;
                            "
                            onmouseover="
                                this.style.transform='translateY(-8px) scale(1.02)'; 
                                this.style.boxShadow='0 8px 25px rgba(76, 175, 80, 0.3)'; 
                                this.style.borderColor='#4CAF50';
                                this.style.background='linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                                this.querySelector('.branch-name').style.color='white';
                                this.querySelector('.branch-icon').style.transform='scale(1.2) rotate(5deg)';
                            "
                            onmouseout="
                                this.style.transform='translateY(0) scale(1)'; 
                                this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'; 
                                this.style.borderColor='#e0e0e0';
                                this.style.background='linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                                this.querySelector('.branch-name').style.color='#02478c';
                                this.querySelector('.branch-icon').style.transform='scale(1) rotate(0deg)';
                            "
                        >
                            <div class="branch-icon" style="
                                font-size: 28px; 
                                margin-bottom: 10px;
                                transition: all 0.3s ease;
                            ">🏢</div>
                            <div class="branch-name" style="
                                font-size: 14px;
                                font-weight: 600;
                                color: #02478c;
                                line-height: 1.4;
                                transition: color 0.3s ease;
                            ">${branch}</div>
                            <div style="
                                position: absolute;
                                top: 8px;
                                right: 8px;
                                width: 8px;
                                height: 8px;
                                background: #4CAF50;
                                border-radius: 50%;
                                box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                            "></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- No Results Message (hidden by default) -->
                <div id="no-results" style="
                    display: none;
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                ">
                    <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                    <p style="font-size: 18px; font-weight: 600; color: #666; margin: 0 0 10px 0;">No branches found</p>
                    <p style="font-size: 14px; color: #999;">Try a different search term</p>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    /* Custom Scrollbar */
                    ::-webkit-scrollbar {
                        width: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.5);
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        border-radius: 10px;
                        border: 2px solid rgba(255, 255, 255, 0.5);
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #ff8a00 0%, #e67a00 100%);
                    }
                </style>
            </div>
        `;
        
        foreignObject.append('xhtml:div')
            .html(branchHTML);
        
        this.currentView = 'branches';
        this.backButton.style('display', 'block');
    }
    
    filterBranches(searchTerm) {
        const cards = document.querySelectorAll('.branch-card');
        const searchLower = searchTerm.toLowerCase().trim();
        let visibleCount = 0;
        
        cards.forEach(card => {
            const branchName = card.getAttribute('data-branch-name');
            if (branchName.includes(searchLower)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update count info
        const countInfo = document.getElementById('branch-count-info');
        const noResults = document.getElementById('no-results');
        const branchGrid = document.getElementById('branch-grid');
        
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            branchGrid.style.display = 'none';
            countInfo.textContent = 'No branches found';
            countInfo.style.color = '#ff8a00';
        } else {
            noResults.style.display = 'none';
            branchGrid.style.display = 'grid';
            const total = cards.length;
            countInfo.textContent = searchTerm ? `Showing ${visibleCount} of ${total} branches` : `Showing all ${total} branches`;
            countInfo.style.color = '#666';
        }
    }
    
    selectBranch(stateName, branchName) {
        this.selectedDistrict = branchName;
        
        // Reset ALL previously selected cards first (prevent multiple selections)
        const cards = document.querySelectorAll('.branch-card');
        cards.forEach(card => {
            card.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            card.style.borderColor = '#e0e0e0';
            card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            card.style.transform = 'translateY(0) scale(1)';
            const branchNameEl = card.querySelector('.branch-name');
            const branchIconEl = card.querySelector('.branch-icon');
            if (branchNameEl) branchNameEl.style.color = '#02478c';
            if (branchIconEl) {
                branchIconEl.innerHTML = '🏢';
                branchIconEl.style.fontSize = '28px';
                branchIconEl.style.color = '';
            }
        });
        
        // Now highlight ONLY the selected card
        cards.forEach(card => {
            const cardBranchName = card.querySelector('.branch-name').textContent;
            if (cardBranchName === branchName) {
                card.style.background = 'linear-gradient(135deg, #02478c 0%, #024070 100%)';
                card.style.borderColor = '#02478c';
                card.style.boxShadow = '0 8px 25px rgba(2, 71, 140, 0.5)';
                card.style.transform = 'scale(1.05)';
                card.querySelector('.branch-name').style.color = 'white';
                card.querySelector('.branch-icon').innerHTML = '✓';
                card.querySelector('.branch-icon').style.fontSize = '36px';
                card.querySelector('.branch-icon').style.color = '#4CAF50';
                
                // Add a checkmark animation
                setTimeout(() => {
                    card.style.animation = 'pulse 0.5s ease-in-out';
                }, 100);
            }
        });
        
        // Get full branch address
        const branchAddress = this.branchAddresses[stateName][branchName];
        
        // Call the callback with branch address
        this.options.onDistrictSelect(stateName, branchName, branchAddress);
    }
    
    async loadStateMap(stateFile, stateName) {
        try {
            const response = await fetch(`/js/topojsons/states/${stateFile}.json`);
            if (!response.ok) throw new Error('State map not found');
            
            const topology = await response.json();
            
            // Get the first object key (it varies by state)
            const objectKey = Object.keys(topology.objects)[0];
            const geojson = topojson.feature(topology, topology.objects[objectKey]);
            
            // Create projection
            const projection = d3.geoMercator()
                .fitSize([this.options.width, this.options.height], geojson);
            
            const path = d3.geoPath().projection(projection);
            
            // Clear existing paths
            this.mapGroup.selectAll('*').remove();
            
            // Draw districts
            this.mapGroup.selectAll('path')
                .data(geojson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', '#2196F3')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .attr('fill', '#ff8a00');
                    
                    const districtName = d.properties.NAME_2 || d.properties.DISTRICT || d.properties.name || 'Unknown';
                    this.tooltip
                        .style('display', 'block')
                        .html(districtName);
                })
                .on('mousemove', (event) => {
                    this.tooltip
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 20) + 'px');
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .attr('fill', '#2196F3');
                    
                    this.tooltip.style('display', 'none');
                })
                .on('click', (event, d) => {
                    const districtName = d.properties.NAME_2 || d.properties.DISTRICT || d.properties.name || 'Unknown';
                    this.selectDistrict(districtName);
                });
            
            this.currentView = 'state';
            this.backButton.style('display', 'block');
            
        } catch (error) {
            throw error;
        }
    }
    
    selectDistrict(districtName) {
        this.selectedDistrict = districtName;
        this.options.onDistrictSelect(this.selectedState, districtName);
    }
    
    showIndiaMap() {
        this.selectedState = null;
        this.selectedDistrict = null;
        
        // Clear everything including foreign objects and revert to map
        this.svg.selectAll('*').remove();
        this.mapGroup = this.svg.append('g');
        
        // Reset the selection display text
        const locationText = document.getElementById('selected-location-text');
        if (locationText) {
            locationText.innerHTML = 'Click on a green state to select your branch';
        }
        
        // Reload the India map
        this.loadIndiaMap();
    }
    
    getStateFileName(stateName) {
        // Convert state name to filename format
        const stateMap = {
            'Andaman and Nicobar': 'andamannicobar',
            'Andhra Pradesh': 'andhrapradesh',
            'Arunachal Pradesh': 'arunachalpradesh',
            'Assam': 'assam',
            'Bihar': 'bihar',
            'Chandigarh': 'chandigarh',
            'Chhattisgarh': 'chhattisgarh',
            'Dadra and Nagar Haveli': 'dadranagarhaveli',
            'Daman and Diu': 'damandiu',
            'Delhi': 'delhi',
            'Goa': 'goa',
            'Gujarat': 'gujarat',
            'Haryana': 'haryana',
            'Himachal Pradesh': 'himachalpradesh',
            'Jammu and Kashmir': 'jammukashmir',
            'Jharkhand': 'jharkhand',
            'Karnataka': 'karnataka',
            'Kerala': 'kerala',
            'Lakshadweep': 'lakshadweep',
            'Madhya Pradesh': 'madhyapradesh',
            'Maharashtra': 'maharashtra',
            'Manipur': 'manipur',
            'Meghalaya': 'meghalaya',
            'Mizoram': 'mizoram',
            'Nagaland': 'nagaland',
            'Odisha': 'odisha',
            'Puducherry': 'puducherry',
            'Punjab': 'punjab',
            'Rajasthan': 'rajasthan',
            'Sikkim': 'sikkim',
            'Tamil Nadu': 'tamilnadu',
            'Telangana': 'telangana',
            'Tripura': 'tripura',
            'Uttar Pradesh': 'uttarpradesh',
            'Uttarakhand': 'uttarakhand',
            'West Bengal': 'westbengal'
        };
        
        return stateMap[stateName] || stateName.toLowerCase().replace(/\s+/g, '');
    }
    
    getSelectedRegion() {
        return {
            state: this.selectedState,
            district: this.selectedDistrict
        };
    }
}

// Make it globally available
window.IndiaMapSelector = IndiaMapSelector;

