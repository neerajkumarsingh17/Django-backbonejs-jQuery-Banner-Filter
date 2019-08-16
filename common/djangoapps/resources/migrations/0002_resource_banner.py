# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Resource_banner',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image_field', models.ImageField(upload_to=b'resourse_banner/')),
                ('image_url', models.URLField(max_length=250, blank=True)),
                ('image_order', models.IntegerField(default=0)),
            ],
        ),
    ]
