const main = document.getElementsByTagName('main')[0]

const cache = {
  '/api/about': [`<pre class="infopre">my %info = qw{<span style="font-size:1.2em;color:#555;">
              name angus_zhang
           twitter <a href="https://twitter.com/nichijou_lab" target="_blank">nichijou_lab</a>
             email angusbike@gmail.com
              desc flag必中型命格，眼高手低
             motto 自律，不装，兼爱</span>
             };

my %site_info = (<span style="font-size:1.2em;color:#555;">
              front_end => [qw| HTML CSS Javascript        |],
               back_end => [qw| Nodejs Express MongoDB     |],
                 credit => [qw| Org-js Prismjs GoogleFonts |],
                   desc => '<a href='/post/41MD'>link</a>',
             repository => '<a href='https://github.com/whitemuu/monodog' target='_blank'>whitemuu/monodog</a>'</span>
                );</pre>`, 'About | nichijou']
}
// age ${new Date().getFullYear() - 1991}

// karasu begin ---------------------------------------------
const karasu = document.getElementById('top')
// why cannot name it foothold in ios/safari
const karasuFoothold = document.getElementById('foothold')

// DOMMouseScroll for firefox
// why not scroll in the first time??
;['mousewheel', 'DOMMouseScroll'].forEach( e => {
  window.addEventListener(e, () => {
    if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
      karasu.style.display = "block"
      karasuFoothold.style.display = "block"
    } else {
      karasu.style.display = "none"
      karasuFoothold.style.display = "none"
    }
  })
})

function fly() {
  karasu.style.transform = "rotate(64deg)"
  window.scrollTo({ top: 0, behavior: 'smooth' })
  window.history.pushState(null, null, ' ')
  document.title = document.title.substr(0, document.title.indexOf('::'))
  karasuFoothold.style.animationName='drop'
  setTimeout(() => {
    karasuFoothold.style.display = "none"
    karasuFoothold.style.animationName=''
  }, 400)
}

window.onscroll = () => {
  if (document.documentElement.scrollTop < 500 && karasu.style.display === "block") {
    karasu.style.animationName='fly'
    setTimeout(() => {
      karasu.style.animationName=''
      karasu.style.display = "none"
      karasu.style.transform = ""
    }, 800)
  }
}
// karasu end-------------------------------------------------

function slappingZero(num, length) {
  return '0'.repeat(length - num.toString().length) + num
}

function encodeDate(str) {
  const [year, month, day, hour] = str.match(/\d{2}/g)
  const date = new Date('20' + year, month - 1, day, hour)
  let startOfDate = new Date(date.getFullYear(), 0, 0)
  let dayOfYear = Math.floor((date - startOfDate)/ (1000 * 60 * 60 * 24))
  return parseInt(year + slappingZero((dayOfYear * 24 + date.getHours()).toString(), 4)).toString(36).toUpperCase()
}

function decodeDate(str) {
  let date = parseInt(str, 36).toString()
  let [, year, hours] = date.match(/(\d{2})(\d{4})/)
  let days = Math.floor(hours / 24)
  date = new Date((days * 24 * 60 * 60 * 1000) + (new Date('20' + year, 0, 0) - 0))
  return year+ slappingZero(date.getMonth() + 1, 2) + slappingZero(date.getDate(), 2) + slappingZero((hours % 24), 2)
}

function genTagsHtml(tags){
  // TODO
  if (tags === undefined) return ''
  tags = '<div class="tags">' + tags.split(' ').reduce((sum, tag) => `${sum}<span id='${tag}'>${tag}</span>`,'') + '</div>'
  return tags.replace(/recommend/g, '˗ˏˋrecommendˎˊ')
}

function genUrlTitle(title) {
  return title.replace(/[?.!]$/, '').replace(/[: ?]+/g, '-')
}

function genCreated(name) {
  return `20${name.substr(0,2)}-${name.substr(2,2)}-${name.substr(4,2)}`
}

function genDateInfo(post) {
  let update = post.update.substr(0, 10)
  let create = genCreated(post.name)
  if (create === update) return `Created: <a href="${post.html_url}" target="_blank">${create}</a>`
  return `Created: ${create} & Updated: <a href="${post.html_url}" target="_blank">${update}</a>`
}

function gaCollect(pagePath) {
  // https://stackoverflow.com/questions/54058464/what-does-gtagjs-new-date-do-in-snippet-proviced-by-gtag-js
  // gtag('js', new Date());
  // console.log(pagePath)
  gtag('config', 'UA-60584744-4', {'page_path': pagePath});
}

const bindSectionJump = () =>
      Array.from(document.getElementsByClassName("section-number")).forEach(sectionNumberElement => {
        sectionNumberElement.onclick = () => {
          // document.getElementById('header-' + sectionNumberElement.innerText.replace(/\./g,"-")).scrollIntoView({behavior: 'smooth', block: 'start'})
          let anchor = 'header-' + sectionNumberElement.innerText.replace(/\./g,"-")
          if (location.hash.substr(1) === anchor) return // avoid multi clicks
          jump(anchor)
          window.history.pushState(null, null, '#' + anchor) // direct set location.hash have effect
        }
        sectionNumberElement.style.cursor = 'pointer'
      })

function jump(anchorID) {
  if (anchorID === ''){
    document.title = document.getElementsByTagName('h1')[0].innerText
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const head = document.getElementById(anchorID)
  head.scrollIntoView({behavior: 'smooth', block: 'start'})
  // console.log(document.title)
  const i = document.title.indexOf('::')
  document.title = (i === -1? document.title : document.title.substr(0, i)) + '::' + head.innerText.replace(/\d+(\.\d+)*/,'')
}

function f404(){
  main.innerHTML = "<div style='color:rgb(50, 50, 50, 20%);font:italic 5em sans-serif;'>404</div><p>Your link is invalid or I've deleted the resource. Sorry for either case.</p>"
}

function loadingEffect() {
  main.innerHTML += '<div id="animation-container"><div class="lds-hourglass"></div></div>'
}

// bind in site link within main
function bindLinkInMain() {
  document.querySelectorAll('main a[href^="/"], main a[href^="."]').forEach(e => e.onclick = () => {
    const href = e.getAttribute("href")
    if (href.startsWith('.')) href.replace('.', '/post')
    route(href)
    purgeActive()
    return false
  })
}

// bind nav clink event
[...document.querySelectorAll('nav a'), ...document.querySelectorAll('header a')].forEach(e => {
  e.onclick = () => {
    // route(e.href) <- full path
    route(e.getAttribute("href"))
    // style
    purgeActive()
    e.id = 'active'
    document.getElementById('top').style.display = 'none';
    document.getElementById('foothold').style.display = 'none';

    return false
  }
})

function purgeActive() {
  let active = document.getElementById('active')
  if (active) {
    active.id = ''
  }
}

let lastPath

function route(path) {

  if(path) {
    if (path === window.location.pathname) return
    window.history.pushState(null, null, path)
  } else {
    path = window.location.pathname
    let nav = document.querySelectorAll(`[href='${path}']`)[0]
    // nav is undefined if visit a post page directly
    if (nav) {
      purgeActive()
      nav.id = 'active'
      document.getElementById('top').style.display = 'none';
      document.getElementById('foothold').style.display = 'none';
    }
  }

  // just push/pop(forward/backword) within page no need to reset main content
  if (location.pathname === lastPath) return jump(location.hash.substr(1))
  lastPath = path

  // console.log(path);
  let hit = cache['/api' + path]
  // console.log(hit);

  if (hit) {
    main.innerHTML = hit[0]
    document.title = hit[1]
    // window.scrollTo({ top: 0, behavior: 'smooth' })
    bindLinkInMain()
    gaCollect(path)
    return
  }

  /* jshint ignore:start */
  if (path === '/') {
    route('/posts')
  } else if (path === '/posts') {

    loadingEffect()
    // setTimeout(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/posts')
        if (res.status !== 200) return f404()
        const posts = await res.json()

        document.title = 'Posts | nichijou'
        cache['/api/posts'] = []
        cache['/api/posts'][1] = 'Posts | nichijou'

        let contents = posts.reduce((sum, post) => {
          let path = `/post/${encodeDate(post.name.substr(0, 8))}/${genUrlTitle(post.title)}`
          return `${sum}<span>\n  (${genCreated(post.name)} '(<a href="${path}" style="font-size:1.5em">${post.title}</a>)
              :tags ${genTagsHtml(post.tags)})</span>`},'')

        contents = `<pre class="infopre">(posts${contents || '\n  nil'})</pre>`

        main.innerHTML = contents
        cache['/api/posts'][0] = contents
        // window.scrollTo({ top: 0, behavior: 'smooth' })
        gaCollect(path)
        bindLinkInMain()
      } catch (e) {
        console.log(e)
      }
    })()
    // }, 100000)

  } else if(path === '/notes') {

    loadingEffect()
    ;(async () => {
      try {
        const res = await fetch('/api/notes')
        if (res.status !== 200) return f404()
        const notes = await res.json()

        document.title = 'Tutor | nichijou'
        cache['/api/notes'] = []
        cache['/api/notes'][1] = 'Tutor | nichijou'

        let contents = notes.reduce((sum, post) => {
          let path = `/post/${post.title.replace(/ /g, '-')}-${parseInt(post.name.substr(0, 10)).toString(36)}`
          return `${sum}<span>\n  (${genCreated(post.name)} '(<a href="${path}" style="font-size:1.5em" onclick="route('${path}'); return false">${post.title}</a>)
              :tags ${genTagsHtml(post.tags)})</span>`},'')

        contents = `<pre class="infopre">(notes${contents || '\n  nil'})</pre>`

        main.innerHTML = contents
        cache['/api/notes'][0] = contents

        gaCollect(path)

      } catch (e) {
        console.log(e)
      }
    })()

  } else if(path === '/tags') {

    loadingEffect()
    ;(async () => {
      try {
        const res = await fetch('/api/tags')
        if (res.status !== 200) return f404()
        let tags = await res.text()
        tags = tags.split(' ').reduce((sum, tag) => {
          sum[tag] = sum[tag] ? sum[tag] + 1 : 1
          return sum
        } , {})

        tags = Object.keys(tags).reduce((sum, tag) => `${sum}<span id="${tag}" style="font-size:${15 + tags[tag] * 2}px">${tag}</span>`, '')
        // console.log(tags)
        tags = tags.replace(/recommend/g, '˗ˏˋrecommendˎˊ')
        tags = `<div id="tags-container" class='tags' style="margin-top:80px">${tags}</div>`
        main.innerHTML = tags

        cache['/api/tags'] = []
        cache['/api/tags'][0] = tags
        cache['/api/tags'][1] = 'Tags | nichijou'

        gaCollect(path)
      } catch (e) {
        console.log(e)
      }
    })()

  } else if(path.startsWith('/post/')) {

    const url = '/api/post/' + decodeDate(path.substr(6, 4))
    // const url = '/api/post/' + parseInt(path.match(/[\/-][a-z0-9]{6}/).substr(1), 36)

    ;(async () => {
      hit = cache[url]
      if (hit) {
        main.innerHTML = hit[0]
        document.title = hit[1]
        // window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        try {
          loadingEffect()
          const res = await fetch(url)
          if (res.status !== 200) return f404()
          const post = await res.json()

          document.title = post.title
          cache[url] = []
          cache[url][1] = post.title
          let content = `<h1>${post.title}</h1>${genTagsHtml(post.tags)}
<div id="meta"><a rel="license" target="_blank" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
<img alt="Creative Commons License" style="border-width:0;opacity:0.5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAPCAIAAAD8q9/YAAAABGdBTUEAANbY1E9YMgAAAZ9JREFUSMflljFrwkAUx98H6J3N6KbXFjtJJZNIB+Ntds0kdIxDp3boTYJ0UDcLutxXOCfbpejQSRE5+g38CvcVrtCTNJVLiFAKaR4ZwvH+yf3yf+/lAHIYOjfxDTybi+jVvesCwGg0ssoopRjjKZ+Y5O3HtnBayISvduApn2CM42hD5splxeQv3hf9fj/DwI3rRrlcTq4NKSUAdG47RrKRm/ZNO6vACCNjr5SSEAIAlFKlFKUUAAghUkpjcs2thVU9fh5b58Lhy37eWxejKmtynOSwV9MA9556ALBcLrXWhBDf97XW7Cscx1FKcc6FEGYRYRRW9Wq9sj794CZhN3GZvyWxAz883gOAlFIpFZ1bvu+7rhutasYYxtioXt9e1tt1gsNWT+J2HPdp0kuOALY6TCkNgsA4zBjjnO8dRkc4nOCVtYzTOHyUJL6H0b6HhRCO4wBAEARhD7uuu9vttNatVqt6VU3Zw+mB/7qHZ3NRb9RLpVKOpvSUTxA6GQ6HCcCe551fnP2T/3A4ugaDgZW26TWLxWK2T1r5OkvnKj4Bfm7H+J/sGfMAAAAASUVORK5CYII=" /></a>
${genDateInfo(post)} by Angus Zhang</div>
${post.content}<div id='eof'>✣</div>`

          // revise path TODO extract out of if clause
          let newPath = `/post/${encodeDate(post.name.substr(0, 8))}/${genUrlTitle(post.title)}`
          if (window.location.pathname !== newPath) {
            window.history.replaceState(null, null, newPath)
          }

          main.innerHTML = content
          cache[url][0] = content
        } catch (e) {
          console.log(e)
        }
      }
      // why set timeout 0 -> schedule after DOM manipulation
      if (window.location.hash) {
        setTimeout(() => {
          jump(window.location.hash.substr(1))
        }, 0)
      }
      bindSectionJump()

      gaCollect(path.substr(0, 10))
    })()

  } else {
    f404()
  }
  /* jshint ignore:end */
}

window.onpopstate = () => {
  route()
}

// init
route()
