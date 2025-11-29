---
title: 使用Duti管理MacOS的默认应用设置
categories:
  - [速查手册]
  - [实用工具]
tags:
  - MacOS
  - 速查手册
  - 实用工具
published: true
date: 2025-11-29 16:35:41
---

# 使用 [duti](https://github.com/moretension/duti) 管理MacOS的默认应用设置

duti 是一个命令行工具，能够使用 Apple 的 .dupset 功能为 macOS 上的各种文档类型设置默认应用程序。 统一类型标识符 `Uniform Type Identifiers` 。UTI 是一个唯一字符串，用于描述文件内容的格式。 例如，一个 Microsoft Word 文档的 UTI 为 com.microsoft.word.doc 。 `duti` 用户可以更改哪个应用程序充当给定 UTI 的默认处理程序。

## 安装（使用Homebrew）

```shell
brew install duti
```

## 使用 `duti` 的前置便利设置

### 在 `.zshrc` 中配置获取应用 `bundleId` 的快捷操作

> 该脚本可以遍历MacOS中的应用，找到匹配的应用并输出其 `bundleId`。**支持前缀模糊查询**，例如输入 `getBundleID "Microsoft Word"` 可以找到 Microsoft Word 的 `bundleId`。输入 `getBundleID Chat` 可以给出一个带序号的可选择列表，获取对应选项的 `bundleId`。

```shell
## ====================================================
## ==============       duti START      ===============
## ====================================================
getBundleID() {
    # 定义局部变量，保存用户输入的搜索词（第一个参数）
    local search_term="$1"
    
    # 检查搜索词是否为空
    if [ -z "$search_term" ]; then
        # 如果为空，显示使用方法并退出函数
        echo "Usage: getBundleIDA <App Name>"
        return 1
    fi

    # 显示绿色的"Loading..."提示符（\033[32m 是绿色，\033[0m 是重置颜色）
    printf "\033[32mLoading...\033[0m"

    # 使用 mdfind 搜索应用程序
    # kMDItemKind == 'Application' 限制只搜索应用程序
    # kMDItemDisplayName == '$search_term*'c 进行前缀匹配（*表示通配符，c表示不区分大小写）
    local results
    results=$(mdfind "kMDItemKind == 'Application' && kMDItemDisplayName == '$search_term*'c")
    
    # 清除加载提示行（\r 回到行首，\033[K 清除从光标到行尾的内容）
    printf "\r\033[K"

    # 调试代码（已注释）
    # echo "DEBUG: Results found: '$results'"

    # 检查搜索结果是否为空
    if [ -z "$results" ]; then
        # 如果没找到匹配的应用，显示提示信息并退出
        echo "No application found matching '$search_term'"
        return 1
    fi

    # 将搜索结果转换为数组（兼容 Bash 和 Zsh）
    local app_array=()
    # 逐行读取结果（IFS= 防止修剪空格，-r 防止反斜杠转义）
    while IFS= read -r line; do
        # 如果行不为空，添加到数组
        [ -n "$line" ] && app_array+=("$line")
    done <<< "$results"  # 使用 here-string 将结果传递给 while 循环
    
    # 获取数组元素数量（匹配到的应用数量）
    local count=${#app_array[@]}

    # 如果只找到一个匹配项
    if [ "$count" -eq 1 ]; then
        # 初始化应用路径变量
        local app_path=""
        # 遍历数组获取第一个元素（用于兼容不同 shell 的数组索引）
        for first in "${app_array[@]}"; do
            app_path="$first"
            break  # 获取第一个后立即退出循环
        done
        
        # 使用 mdls 获取应用的 Bundle ID 并输出（-raw 去除引号）
        mdls -name kMDItemCFBundleIdentifier -raw "$app_path"
        echo ""  # 输出换行符
    else
        # 如果找到多个匹配项
        echo "Multiple applications found:"
        
        # 初始化计数器
        local i=1
        # 遍历所有匹配的应用
        for app in "${app_array[@]}"; do
            # 获取应用名称（去除路径和.app后缀）
            local app_name=$(basename "$app" .app)
            # 格式化输出：序号和应用名称，左对齐30个字符宽度
            printf "%-30s" "$i) $app_name"
            
            # 每3个应用换一行（横向布局）
            if (( i % 3 == 0 )); then
                echo ""
            fi
            ((i++))  # 计数器递增
        done
        # 如果最后一行不满3个，确保换行
        if (( (i-1) % 3 != 0 )); then
            echo ""
        fi

        # 显示交互式选择提示
        echo ""
        local selection
        printf "Select an application (1-$count): "
        read selection  # 读取用户输入的选择

        # 验证用户输入：必须是数字且在有效范围内
        if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "$count" ]; then
            # 使用循环方式获取选中的元素（兼容不同 shell）
            local current_idx=1
            local app_path=""
            for app in "${app_array[@]}"; do
                # 如果当前索引匹配用户选择
                if [ "$current_idx" -eq "$selection" ]; then
                    app_path="$app"
                    break  # 找到后退出循环
                fi
                ((current_idx++))  # 索引递增
            done
            
            # 使用 mdls 获取选中应用的 Bundle ID 并输出
            mdls -name kMDItemCFBundleIdentifier -raw "$app_path"
            echo ""  # 输出换行符
        else
            # 如果输入无效，显示错误信息
            echo "Invalid selection."
            return 1
        fi
    fi
}
```

### 在 `.zshrc` 中配置获取文件格式 `Uniform Type Identifiers` 的快捷操作

> 该命令使用方式为 `getuti example.json`，获取的结果如下:
>
> ```text
> kMDItemContentType     = "public.json"
> kMDItemContentTypeTree = (
>     "public.json",
>     "public.text",
>     "public.data",
>     "public.item",
>     "public.content"
> )
> kMDItemKind            = "JSON Document"
> ```

```shell
alias getuti="mdls -name kMDItemContentType -name kMDItemContentTypeTree -name kMDItemKind "
```

## 使用方法

### `man duti | cat` 获取 `duti` 的说明

```text
duti(1)                          User Commands                         duti(1)

NAME
       duti - set default document and URL handlers

SYNOPSIS
       duti [ -hVv ] [ -d uti ] [ -l uti ] [ settings_path ]

       duti -s bundle_id { uti | url_scheme | extension | MIME_type } [ role ]

       duti -x extension


DESCRIPTION
       duti sets applications as default handlers for Apple's Uniform Type
       Identifiers, for URL schemes, filename extensions, and MIME types.  If
       settings_path is not given on the command line, duti reads settings
       lines from stdin. If settings_path is a directory, duti applies
       settings from the files in settings_path.

       The -s flag tells duti to set a handler based on arguments from the
       command line. Two arguments following -s means that duti will set the
       handler for a URL scheme. Three arguments means duti will set the
       handler for a UTI, an extension or a MIME type, depending on the
       formatting of the second argument.  duti treats an argument beginning
       with a dot as an extension. If the argument contains no dots, duti also
       considers the argument a filename extension, unless it contains a
       slash, in which case duti treats the argument as a MIME type. In all
       other cases, duti treats the second argument as a UTI.

       duti -x retrieves and prints out information describing the default
       application for files with the extension extension.

       See EXAMPLES below for usage cases.


SETTINGS FILE
       A settings file is made up of lines with the following format:

            app_id    UTI    role

       The app_id is a bundle ID representing the application that will act as
       the handler for documents associated with UTI.  For example:

            com.apple.Safari    public.html    all

       would cause duti to set Safari as the default handler in all situations
       for HTML documents.  A settings file can also contain lines with this
       format:

            app_id    url_scheme

       In this case, app_id is again a bundle ID, this time for the
       application that will act as the default handler for url_scheme.  For
       example:

            org.mozilla.Firefox     ftp

       would cause duti to set Firefox as the handler for "ftp://" URLs.

SETTINGS PLIST
       If the extension of the file given to duti is .plist, duti treats the
       file as an XML property list (plist).  The plist must contain a key-
       value pair, in which the key is "DUTISettings" and the value is an
       array of dictionaries. Each dictionary in the array contains three key-
       value pairs representing the application's bundle ID, the UTI and the
       role, respectively. Alternatively, a dictionary in the array may
       contain two key-value pairs representing the application's bundle ID,
       and the URL scheme. A simple plist designed to set Safari as the
       default handler of HTML files, and Firefox as the default handler for
       "ftp://" URLs, would look like this:

            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
       "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
            <dict>
                 <key>DUTISettings</key>
                 <array>
                      <dict>
                           <key>DUTIBundleIdentifier</key>
                           <string>com.apple.Safari</string>
                           <key>DUTIUniformTypeIdentifier</key>
                           <string>public.html</string>
                           <key>DUTIRole</key>
                           <string>all</string>
                      </dict>
                      <dict>
                           <key>DUTIBundleIdentifier</key>
                           <string>org.mozilla.Firefox</string>
                           <key>DUTIURLScheme</key>
                           <string>ftp</string>
                      </dict>
                 </array>
            </dict>
            </plist>


ROLES
       Valid roles are defined as follows:


       all                application handles all roles for the given UTI.

       viewer             application handles reading and displaying documents
                          with the given UTI.

       editor             application can manipulate and save the item.
                          Implies viewer.

       shell              application can execute the item.

       none               application cannot open the item, but provides an
                          icon for the given UTI.

EXAMPLES
       Running duti with -s :

            # Set Safari as the default handler for HTML documents
            duti -s com.apple.Safari public.html all

            # Set Finder as the default handler for the ftp:// URL scheme
            duti -s com.apple.Finder ftp


       Retrieving default application information for an extension:

            # default application information for .html files
            % duti -x html
            Safari
            /Applications/Safari.app
            com.apple.Safari


       The following examples can be used by passing them to duti on stdin or
       as lines in a .duti file.

       Set TextEdit as the default viewer for Microsoft Word documents:

            com.apple.TextEdit    com.microsoft.word.doc    viewer

       Set VLC as the default viewer for files with .m4v extensions:

            org.videolan.vlc   m4v   viewer

       Set iHook as the default executor of shell scripts:

            edu.umich.iHook    public.shell-script    shell

       Set Xcode as the default editor for C source files:

            com.apple.Xcode    public.c-source    editor


OPTIONS
       -d uti             display the default handler for uti and exit.

       -h                 print usage and exit.

       -l uti             display all handlers for uti and exit.

       -s                 set the handler from data provided on the command
                          line.

       -V                 print version number and exit.

       -v                 verbose output.

       -x ext             print information describing the default application
                          for extension ext.


EXIT STATUS
       0    All settings applied or displayed successfully.

       1    Settings could not be applied, or the UTI has no handler.

       >1   Error.


MORE INFO
       Mac OS X ships with a number of UTIs already defined. Most third-party
       software is responsible for defining its own UTIs. Apple documents UTIs
       in the Apple Developer Connection Library at:

            http://developer.apple.com/referencelibrary/

       More technical information, including APIs, can be found at:

            http://developer.apple.com/macosx/uniformtypeidentifiers.html

       To get a list of UTIs on your system, you can use the following command
       line:

            `locate lsregister` -dump | grep '[[:space:]]uti:' \
                 | awk '{ print $2 }' | sort | uniq


SEE ALSO
       plutil(1), plist(5)

Andrew Mortensen               _DUTI_BUILD_DATE                        duti(1)
```

### 命令行

```shell
# 使用 getuti 获取word文件的uti 
# 使用 getBundleID 获取word应用的bundleId
# 执行配置命令

duti -s com.microsoft.word.doc com.microsoft.Word all

```

### 使用echo 管道设置 Word 文档默认打开方式`

```shell
echo 'com.apple.TextEdit   com.microsoft.word.doc all' | duti
```

### 使用 `duti setting` 文件配置

| 执行命令 `duti default_app_setting.duti` 使配置生效

```shell
# Settings for duti 
# ==========================================
# Target App: com.google.antigravity
# Generated from user screenshots
# ==========================================

# --- 纯文本与日志 ---
com.google.antigravity    public.plain-text                    all
com.google.antigravity    com.apple.log                        all

```

### 使用 `plist` 配置

> 之前使用过其他的自定义 `plist`，由于 `MacOS` 更新系统的时候自动清除了我的 `plist`，避免出现类似情况，这种配置方式不做尝试，想要使用的话可以自行探索

## 效果验证

```shell
duti -x docx
```
