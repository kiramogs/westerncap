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
        
        // Western Capital operational states and their branches
        this.operationalStates = {
            'Rajasthan': ['Ajmer', 'Chittorgarh', 'Chomu', 'Fatehnagar', 'Gulabpura', 'Jhunjhunu', 'Beawar', 'Kotputli', 'Rajsamand', 'Kuchaman', 'Sojat', 'Neem Ka Thana', 'Sujangarh', 'Jaipur', 'Sikar', 'Kekri', 'Nimbahera', 'Udaipur', 'Sumerpur', 'Ratangarh', 'Nokha', 'Phalodi'],
            'Maharashtra': ['Akola', 'Baramati', 'Dhule', 'Buldhana', 'Karad', 'Nagpur', 'Jalgaon', 'Kalyan', 'Kolhapur', 'Nashik', 'Pune', 'Sangli', 'Satara', 'Yavatmal', 'Sangamner', 'HO - Maharashtra ISD', 'OPS HUB - Maharashtra ISD'],
            'Madhya Pradesh': ['Dewas', 'Dhamnod', 'Indore', 'Khargone', 'Jaora', 'Sehore', 'Ujjain', 'Hoshangabad', 'Mandsaur', 'Shamgarh', 'Manasa', 'Shujalpur', 'Khandwa', 'Khategaon'],
            'Tamil Nadu': ['Nagarcoil', 'Madurai', 'Theni', 'Tirunelveli', 'Sivakasi', 'Thoothukudi', 'Karaikudi', 'Namakkal', 'Salem', 'Krishnagiri', 'Erode', 'Viluppuram', 'Kallakurichi', 'Dharmapuri'],
            'Telangana': ['Medchal', 'Ibrahimpatnam', 'Siddipet', 'Jangaon', 'Kamareddy', 'Jagtial', 'Karimnagar'],
            'Karnataka': ['Belgaum', 'Davanagere', 'Haveri', 'Chitradurga', 'Hospet', 'Shimoga', 'Gadag']
        };
        
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
        this.selectedState = stateName;
        this.options.onStateSelect(stateName);
        
        // Show branch list instead of district map
        this.showBranchList(stateName);
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
        
        // Add visual feedback - highlight selected card
        const cards = document.querySelectorAll('.branch-card');
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
        
        // Call the callback
        this.options.onDistrictSelect(stateName, branchName);
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

