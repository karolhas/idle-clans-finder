import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (!page) {
    return NextResponse.json({ error: 'Page parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching wiki page:', page); // Debug log

    // Helper function to try grabbing a page
    const tryFetchPage = async (pageName: string) => {
      const response = await fetch(
        `https://wiki.idleclans.com/api.php?action=parse&page=${encodeURIComponent(pageName)}&format=json&prop=text&redirects=true`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch wiki content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.error?.code) {
        return data;
      }
      return null;
    };

    // First try the original page name
    let data = await tryFetchPage(page);
    
    // If that fails and it's a pet name, try the wiki name
    if (!data) {
      const petNameMap: { [key: string]: string } = {
        // Combat pets
        'magic': "Lil' wizard",
        'melee': "Lil' fighter",
        'archery': "Lil' archer",
        'defence': "Lil' eclipse",
        'gilded_pet_1': "Lil' companion",
        'gilded_pet_2': "Lil' swagger",
        // Skill pets
        'agility': "Lil' runner",
        'brewing': "Lil' brewer",
        'carpentry': "Lil' carpenter",
        'crafting': "Lil' crafter",
        'chef': "Lil' chef",
        'enchanting': "Lil' enchanter",
        'farming': "Lil' farmer",
        'foraging': "Lil' forager",
        'mining': "Lil' miner",
        'plundering': "Lil' plunderer",
        'smithing': "Lil' smither",
        'woodcutting': "Lil' chopper"
      };
      
      // Check if any pet type exists in the page name
      const petType = Object.keys(petNameMap).find(type => {
        const lowerPage = page.toLowerCase();
        if (type === 'gilded') {
          // For gilded pets, check for gilded_pet_X pattern
          return /^gilded_pet_\d+$/.test(lowerPage);
        }
        return lowerPage === type || lowerPage.startsWith(`${type} `);
      });
      
      if (petType) {
        console.log('Found pet type:', petType, 'mapping to:', petNameMap[petType]);
        data = await tryFetchPage(petNameMap[petType]);
      }
    }
    
    // If that fails and the name contains a possessive form, try with an apostrophe
    if (!data && (page.includes('Warriors') || page.includes('Mages') || page.includes('Nagas') || page.includes('Archers') || page.includes('Guardians') || page.includes('Necromancers'))) {
      const apostropheVersion = page
        .replace('Warriors', "Warrior's")
        .replace('Mages', "Mage's")
        .replace('Nagas', "Naga's")
        .replace('Archers', "Archer's")
        .replace('Guardians', "Guardian's")
        .replace('Necromancers', "Necromancer's");
      console.log('Trying with apostrophe:', apostropheVersion);
      data = await tryFetchPage(apostropheVersion);
    }
    
    // If that fails and contains tier, try capitalizing it and other checks
    if (!data && page.includes('tier')) {
      const capitalizedVersion = page.replace(/tier/i, 'Tier');
      const withParentheses = capitalizedVersion.replace(/Tier_(\d+)/, '(Tier_$1)');
      console.log('Trying with capitalized Tier and parentheses:', withParentheses);
      data = await tryFetchPage(withParentheses);
    }
    
    // If still not found, try searching
    if (!data) {
      console.log('Page not found, searching for alternatives...'); // Debug log
      
      const searchResponse = await fetch(
        `https://wiki.idleclans.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(page)}&format=json`
      );
      
      if (!searchResponse.ok) {
        console.error('Wiki search error:', searchResponse.status, searchResponse.statusText);
        throw new Error(`Failed to search wiki: ${searchResponse.status} ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      console.log('Wiki search response:', searchData); // Debug log
      
      if (searchData.query?.search?.[0]) {
        // If we found a match, try to get that page
        const correctPage = searchData.query.search[0].title;
        console.log('Found matching page:', correctPage); // Debug log
        
        data = await tryFetchPage(correctPage);
      }
    }

    if (data) {
      return NextResponse.json(data);
    } else {
      // No results found
      return NextResponse.json(
        { error: { code: 'missingtitle', info: 'Item not found in wiki' } },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Wiki API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch wiki content' },
      { status: 500 }
    );
  }
} 