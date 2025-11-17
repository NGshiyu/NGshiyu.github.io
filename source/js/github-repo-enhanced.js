/**
 * 增强的GitHub仓库卡片插件
 * 支持多语言显示和更好的自定义功能
 */

const axios = require('axios');

function split_path(path) {
    let path_arr = path.split("/")
    let len = path.split("/").length
    let res_arr = path_arr.slice(len - 2, len)
    return res_arr.join('/')
}

function unit(number) {
    let _number = number / 1000;
    if (_number >= 1000) {
        return parseFloat((_number / 1000).toFixed(1)) + 'm'
    } else if (_number >= 1) {
        return parseFloat(_number.toFixed(1)) + 'k'
    } else {
        return number;
    }
}

// 格式化语言列表的函数
function formatLanguageList(languages, primaryLanguage) {
    if (!languages || Object.keys(languages).length === 0) {
        return primaryLanguage || 'N/A';
    }

    if (typeof languages === 'string') {
        return languages;
    }

    // 获取语言列表并按使用量排序
    const languageList = Object.keys(languages)
        .map(lang => ({
            name: lang,
            bytes: languages[lang]
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 3); // 最多显示3个语言

    return languageList.map(lang => lang.name).join(', ');
}

hexo.extend.tag.register('githubrepo-enhanced', async function (args, content) {
    const repoPath = args[0];
    const cacheTime = args[1] || 3600; // 缓存时间（秒）

    try {
        // 获取仓库基本信息
        const repoResponse = await axios.get(`https://api.github.com/repos/${split_path(repoPath)}`, {
            headers: {
                'User-Agent': 'Hexo GitHub Repo Enhanced Plugin',
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        // 获取语言信息
        let languages = {};
        try {
            const langResponse = await axios.get(`https://api.github.com/repos/${split_path(repoPath)}/languages`, {
                headers: {
                    'User-Agent': 'Hexo GitHub Repo Enhanced Plugin',
                    'Accept': 'application/vnd.github.v3+json',
                }
            });
            languages = langResponse.data;
        } catch (langError) {
            console.warn(`Failed to fetch languages for ${repoPath}:`, langError.message);
            // 使用主要语言作为备选
            languages = repoResponse.data.language;
        }

        const data = repoResponse.data;
        const formattedLanguages = formatLanguageList(languages, data.language);

        // 生成HTML结构（移除了内联CSS，使用外部样式）
        return `<div class="gr-card-enhanced" data-languages="${encodeURIComponent(JSON.stringify(languages))}">
            <div class="gr-header">
                <img src="${data.owner.avatar_url}" alt="${data.owner.login}" loading="lazy">
            </div>
            <div class="gr-content">
                <div class="gr-fullname">
                    <p><i class="fab fa-github" aria-hidden="true"></i> ${data.full_name}</p>
                </div>
                <div class="gr-description">
                    ${data.description || 'No description available'}
                </div>
            </div>
            <div class="gr-footer">
                <div class="gr-language-star">
                    <span class="gr-language" title="${Object.keys(languages).length > 1 ? 'Multiple languages' : 'Primary language'}">${formattedLanguages}</span>
                    <i class="far fa-star" aria-hidden="true"> ${unit(data.stargazers_count)}</i>
                </div>
                <div class="gr-card-toolbar">
                    <div class="gr-repo-link">
                        <a href="${data.html_url}" target="_blank" rel="noopener noreferrer" title="Open in GitHub">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

    } catch (error) {
        console.error(`GitHub Repo Enhanced Error for ${repoPath}:`, error.message);

        // 错误时显示友好的提示
        return `<div class="gr-card-enhanced gr-error">
            <div class="gr-header">
                <div class="gr-avatar-placeholder">
                    <i class="fab fa-github"></i>
                </div>
            </div>
            <div class="gr-content">
                <div class="gr-fullname">
                    <p><i class="fab fa-github"></i> ${repoPath}</p>
                </div>
                <div class="gr-description">
                    Unable to load repository information
                </div>
            </div>
            <div class="gr-footer">
                <div class="gr-language-star">
                    <span class="gr-language">N/A</span>
                    <i class="far fa-star"> 0</i>
                </div>
                <div class="gr-card-toolbar">
                    <div class="gr-repo-link">
                        <a href="https://github.com/${repoPath}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    }
}, { async: true });