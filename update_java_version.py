import os
import re

def update_java_version(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # تحديث إصدار Java إلى 17 في جميع أنحاء الملف
        updated_content = re.sub(
            r'(sourceCompatibility\s*=\s*JavaVersion\.VERSION_)\d+',
            r'\g<1>17',
            content
        )
        
        updated_content = re.sub(
            r'(targetCompatibility\s*=\s*JavaVersion\.VERSION_)\d+',
            r'\g<1>17',
            updated_content
        )
        
        updated_content = re.sub(
            r'(jvmTarget\s*=\s*['"])\d+(['"])',
            r'\g<1>17\g<2>',
            updated_content
        )
        
        # تحديث إعدادات Java في كتلة compileOptions
        updated_content = re.sub(
            r'(compileOptions\s*\{[^}]*sourceCompatibility\s*).*?\n(\s*.*?targetCompatibility\s*).*?\n',
            r'\1JavaVersion.VERSION_17\n\2JavaVersion.VERSION_17\n',
            updated_content,
            flags=re.DOTALL
        )
        
        # إذا كان هناك تغيير، نقوم بحفظ الملف
        if content != updated_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            print(f'تم تحديث: {file_path}')
        else:
            print(f'لا يوجد تغيير مطلوب في: {file_path}')
            
    except Exception as e:
        print(f'خطأ في معالجة الملف {file_path}: {str(e)}')

def find_and_update_gradle_files(directory):
    for root, _, files in os.walk(directory):
        # تخطي مجلد node_modules
        if 'node_modules' in root.split(os.path.sep):
            continue
            
        for file in files:
            if file == 'build.gradle' or file == 'gradle.properties':
                file_path = os.path.join(root, file)
                print(f'\nمعالجة الملف: {file_path}')
                update_java_version(file_path)

if __name__ == '__main__':
    project_dir = os.path.dirname(os.path.abspath(__file__))
    print('بدء تحديث إصدار Java إلى 17...')
    find_and_update_gradle_files(project_dir)
    print('\nاكتمل التحديث بنجاح!')
