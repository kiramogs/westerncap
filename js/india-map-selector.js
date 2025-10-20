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
                .attr('fill', '#4CAF50')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .attr('fill', '#ff8a00');
                    
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    this.tooltip
                        .style('display', 'block')
                        .html(stateName);
                })
                .on('mousemove', (event) => {
                    this.tooltip
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 20) + 'px');
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .attr('fill', '#4CAF50');
                    
                    this.tooltip.style('display', 'none');
                })
                .on('click', (event, d) => {
                    const stateName = d.properties.ST_NM || d.properties.NAME_1 || 'Unknown';
                    this.selectState(stateName);
                });
            
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
        
        // Convert state name to filename format
        const stateFile = this.getStateFileName(stateName);
        
        try {
            await this.loadStateMap(stateFile, stateName);
        } catch (error) {
            console.error('Error loading state map:', error);
            alert('District map not available for ' + stateName);
        }
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

