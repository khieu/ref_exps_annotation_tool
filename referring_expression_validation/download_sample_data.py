import subprocess
import pandas as pd


for file_id in range(20):
	#file_id = 200

	#subprocess.run([f'scp pc7:/scratch2/hle/refCOCO/test/attr_tables/attr_{file_id}.tsv ./'], shell=True)
	#subprocess.run([f'scp pc7:/scratch2/hle/refCOCO/test/labels/lab_{file_id}.json ./'], shell=True)
	#df = pd.read_csv(f'./attr_{file_id}.tsv', encoding='utf-8',sep='\t')
	#img_id = df['image_id'][0]
	subprocess.run([f'scp pc7:/scratch2/hle/git/rsa_refer/data/validation_images/test/validation_img_{file_id}.png ./'], shell=True)

